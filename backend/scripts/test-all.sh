#!/usr/bin/env bash
# ============================================================
# End-to-end smoke test for the STP-UB API.
# Exits non-zero on the first failure.
#
# Run after `npm run db:bootstrap` and `npm run dev` in another
# terminal. Server expected at http://localhost:5000.
# ============================================================

set -euo pipefail

API="${API:-http://localhost:5000/api}"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-admin123}"

# ANSI colors
G='\033[0;32m'  # green
R='\033[0;31m'  # red
Y='\033[0;33m'  # yellow
B='\033[0;34m'  # blue
N='\033[0m'     # reset

PASS_COUNT=0
FAIL_COUNT=0

# -------- helpers --------------------------------------------
ok()    { printf "  ${G}✓${N} %s\n" "$1"; PASS_COUNT=$((PASS_COUNT+1)); }
fail()  { printf "  ${R}✗${N} %s\n" "$1"; FAIL_COUNT=$((FAIL_COUNT+1)); }
section() { printf "\n${B}== %s ==${N}\n" "$1"; }

# Verify expected http status of a request.
#   expect_status METHOD URL EXPECTED [BEARER] [BODY]
expect_status() {
  local method="$1" url="$2" expected="$3" bearer="${4:-}" body="${5:-}"
  local args=(-s -o /dev/null -w "%{http_code}" -X "$method" "$url")
  [ -n "$bearer" ] && args=(-H "Authorization: Bearer $bearer" "${args[@]}")
  if [ -n "$body" ]; then
    args+=(-H "Content-Type: application/json" -d "$body")
  fi
  local got
  got=$(curl "${args[@]}")
  if [ "$got" = "$expected" ]; then
    ok "$method $url -> $got"
  else
    fail "$method $url -> $got (expected $expected)"
  fi
}

# Run a JSON request & echo response body.
http_json() {
  local method="$1" url="$2" bearer="${3:-}" body="${4:-}"
  local args=(-s -X "$method" "$url")
  [ -n "$bearer" ] && args=(-H "Authorization: Bearer $bearer" "${args[@]}")
  if [ -n "$body" ]; then
    args+=(-H "Content-Type: application/json" -d "$body")
  fi
  curl "${args[@]}"
}

# Pull a JSON path via python (jq-free environment).
json_get() {
  python3 -c "import sys, json; d=json.load(sys.stdin); print($1)"
}

# -------- 0. Health & smoke prerequisites --------------------
section "Health & Auth"
expect_status GET  "$API/health" 200
expect_status POST "$API/auth/login" 400 "" '{}'                       # bad request
expect_status POST "$API/auth/login" 401 "" '{"username":"nope","password":"nope"}'

# Login (real)
LOGIN_RES=$(http_json POST "$API/auth/login" "" "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}")
TOKEN=$(echo "$LOGIN_RES" | json_get "d['response']['accessToken']")
USER_UUID=$(echo "$LOGIN_RES" | json_get "d['response']['user']['userid']")
[ -n "$TOKEN" ] && ok "login ok, token len ${#TOKEN}" || fail "login failed"

# Protected endpoints reject missing/invalid token
expect_status GET "$API/contract" 401
expect_status GET "$API/contract" 401 "INVALID_TOKEN"

# -------- 1. Contract ---------------------------------------
section "Contract"
expect_status GET "$API/contract" 200 "$TOKEN"

CONTRACT=$(http_json GET "$API/contract" "$TOKEN")
ITEM_COUNT=$(echo "$CONTRACT" | json_get "len(d['response']['contract'])")
[ "$ITEM_COUNT" = "6" ] && ok "contract has 6 modules" || fail "contract has $ITEM_COUNT modules (expected 6)"

# -------- 2. Per-module CRUD --------------------------------
test_module() {
  local label="$1" path="$2" payload="$3" patch_payload_template="$4"
  section "Module: $label  ($path)"

  # READ
  expect_status GET "$API/data$path" 200 "$TOKEN"

  # POST insert
  local insert_res
  insert_res=$(http_json POST "$API/data$path" "$TOKEN" "$payload")
  local row_id
  row_id=$(echo "$insert_res" | json_get "d['response']['rowIds'][0]")
  if [ -n "$row_id" ]; then
    ok "INSERT row_id=$row_id"
  else
    fail "INSERT failed: $insert_res"
    return 1
  fi

  # PATCH update — replace placeholder __ROW_ID__ with actual row id
  local patch_payload="${patch_payload_template//__ROW_ID__/$row_id}"
  expect_status PATCH "$API/data$path" 200 "$TOKEN" "$patch_payload"

  # PATCH delete
  local delete_payload
  delete_payload="{\"typeName\":\"table\",\"newValue\":[{\"rowId\":\"$row_id\",\"colValues\":null}]}"
  expect_status PATCH "$API/data$path" 200 "$TOKEN" "$delete_payload"
}

test_module "Pertanian" "/pertanian/items" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"E2E_Pertanian"},{"colIdx":1,"value":100},{"colIdx":2,"value":3},{"colIdx":3,"value":4},{"colIdx":4,"value":500},{"colIdx":5,"value":"Kg"},{"colIdx":6,"value":"e2e test"}]}]}' \
  '{"typeName":"table","newValue":[{"rowId":"__ROW_ID__","colValues":[{"colIdx":0,"value":"E2E_Pertanian_Updated"}]}]}'

test_module "Peternakan" "/peternakan/items" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"E2E_Peternakan"},{"colIdx":1,"value":200},{"colIdx":2,"value":1},{"colIdx":3,"value":1},{"colIdx":4,"value":5},{"colIdx":5,"value":"Ekor"},{"colIdx":6,"value":"e2e"}]}]}' \
  '{"typeName":"table","newValue":[{"rowId":"__ROW_ID__","colValues":[{"colIdx":4,"value":99}]}]}'

test_module "Konservasi Hewan" "/konservasi/hewan" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"E2E_Hewan"},{"colIdx":1,"value":""},{"colIdx":2,"value":7},{"colIdx":3,"value":"Ekor"},{"colIdx":4,"value":"e2e"}]}]}' \
  '{"typeName":"table","newValue":[{"rowId":"__ROW_ID__","colValues":[{"colIdx":2,"value":15}]}]}'

test_module "Konservasi Tanaman" "/konservasi/tanaman" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"E2E_Tanaman"},{"colIdx":1,"value":300},{"colIdx":2,"value":2},{"colIdx":3,"value":3},{"colIdx":4,"value":600},{"colIdx":5,"value":"Kg"},{"colIdx":6,"value":"e2e"}]}]}' \
  '{"typeName":"table","newValue":[{"rowId":"__ROW_ID__","colValues":[{"colIdx":4,"value":700}]}]}'

test_module "Akademik" "/akademik/items" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"E2E_Mahasiswa"},{"colIdx":1,"value":"E2E_Dosen"},{"colIdx":2,"value":"E2E_Prodi"},{"colIdx":3,"value":"2026-01-01T00:00:00.000Z"},{"colIdx":4,"value":"2026-06-30T00:00:00.000Z"},{"colIdx":5,"value":120},{"colIdx":6,"value":"E2E judul penelitian"}]}]}' \
  '{"typeName":"table","newValue":[{"rowId":"__ROW_ID__","colValues":[{"colIdx":6,"value":"Updated judul"}]}]}'

test_module "Kemitraan" "/kemitraan/items" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"E2E Mitra"},{"colIdx":1,"value":"E2E Bidang"},{"colIdx":2,"value":"2026-05-01T00:00:00.000Z"},{"colIdx":3,"value":"2027-05-01T00:00:00.000Z"},{"colIdx":4,"value":"e2e"}]}]}' \
  '{"typeName":"table","newValue":[{"rowId":"__ROW_ID__","colValues":[{"colIdx":1,"value":"Bidang Updated"}]}]}'

# -------- 3. Aggregate query ---------------------------------
section "Aggregate /query"
QUERY_BODY='{"queries":[{"code":"1f0c9d2a-3b4c-6d7e-8f90-aaaaaaaaaa01","params":{"limit":2}},{"code":"00000000-0000-0000-0000-000000000000"}]}'
QUERY_RES=$(http_json POST "$API/query" "$TOKEN" "$QUERY_BODY")
RES_LEN=$(echo "$QUERY_RES" | json_get "len(d['response'])")
HAS_ERR=$(echo "$QUERY_RES" | json_get "'error' in d['response'][1]")
[ "$RES_LEN" = "2" ] && ok "/query returned 2 items" || fail "/query returned $RES_LEN items"
[ "$HAS_ERR" = "True" ] && ok "/query reports per-item error correctly" || fail "/query did not report per-item error"

# -------- 4. Users CRUD --------------------------------------
section "Users CRUD"
expect_status GET "$API/users" 200 "$TOKEN"

NEW_USER_RES=$(http_json POST "$API/users" "$TOKEN" \
  '{"username":"e2euser","password":"e2epass","name":"E2E User","roles":{"kst_jatikerto":["viewer"]}}')
NEW_UUID=$(echo "$NEW_USER_RES" | json_get "d['response']['userid']")
if [ -n "$NEW_UUID" ]; then ok "POST /users -> $NEW_UUID"; else fail "create user failed"; fi

expect_status GET "$API/users/$NEW_UUID" 200 "$TOKEN"
expect_status PUT "$API/users/$NEW_UUID" 200 "$TOKEN" '{"name":"E2E Updated"}'

# duplicate username -> 409
expect_status POST "$API/users" 409 "$TOKEN" \
  '{"username":"e2euser","password":"x","name":"x","roles":{"kst_jatikerto":["viewer"]}}'

expect_status DELETE "$API/users/$NEW_UUID" 204 "$TOKEN"
expect_status GET    "$API/users/$NEW_UUID" 404 "$TOKEN"

# -------- 5. RBAC: viewer can't write ------------------------
section "RBAC enforcement"
# create a viewer user
http_json POST "$API/users" "$TOKEN" \
  '{"username":"e2eviewer","password":"viewerpw","name":"Viewer","roles":{"kst_jatikerto":["viewer"]}}' > /dev/null
VIEWER_LOGIN=$(http_json POST "$API/auth/login" "" '{"username":"e2eviewer","password":"viewerpw"}')
VIEWER_TOKEN=$(echo "$VIEWER_LOGIN" | json_get "d['response']['accessToken']")
[ -n "$VIEWER_TOKEN" ] && ok "viewer login ok" || fail "viewer login failed"

# Viewer can read
expect_status GET "$API/data/pertanian/items" 200 "$VIEWER_TOKEN"
# Viewer cannot write
expect_status POST "$API/data/pertanian/items" 403 "$VIEWER_TOKEN" \
  '{"typeName":"table","newValue":[{"colValues":[{"colIdx":0,"value":"X"}]}]}'
# Viewer cannot list users
expect_status GET "$API/users" 403 "$VIEWER_TOKEN"

# Cleanup viewer (need uuid first)
VIEWER_UUID=$(echo "$VIEWER_LOGIN" | json_get "d['response']['user']['userid']")
expect_status DELETE "$API/users/$VIEWER_UUID" 204 "$TOKEN"

# -------- 6. Public endpoints --------------------------------
section "Public endpoints (no auth)"
for p in pertanian peternakan akademik konservasi/hewan konservasi/tanaman; do
  expect_status GET "$API/public/$p" 200
done

# -------- 7. 404 / unknown paths ----------------------------
section "404 handling"
expect_status GET "$API/data/unknown/path" 404 "$TOKEN"
expect_status GET "$API/wrong/endpoint"    404

# -------- summary --------------------------------------------
section "Summary"
TOTAL=$((PASS_COUNT + FAIL_COUNT))
printf "  Passed: ${G}%d${N} / %d\n" "$PASS_COUNT" "$TOTAL"
printf "  Failed: ${R}%d${N} / %d\n" "$FAIL_COUNT" "$TOTAL"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf "\n${R}Some tests failed.${N}\n"
  exit 1
else
  printf "\n${G}All tests passed.${N}\n"
fi
