#!/usr/bin/env bash
set -e
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['accessToken'])")
echo "=== All admin endpoints check ==="
for path in pertanian/items peternakan/items konservasi/hewan konservasi/tanaman akademik/items kemitraan/items; do
  echo -n "/data/$path : "
  curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:5000/api/data/$path?limit=5" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('rows', len(d['response']['data']['items']) if d.get('response') else 'ERR', '- code', d['response'].get('code','')[:8]+'...' if d.get('response') else '')"
done
