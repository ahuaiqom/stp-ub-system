/**
 * Public (unauthenticated) endpoints used by the landing site.
 */
import { request } from "./api";

export interface PageContainer<T> {
  offset: number;
  limit: number;
  hasNext: boolean;
  items: T[];
}

export interface PertanianRow {
  komoditas: string;
  luasUsaha: number;
  masaTanamBulan: number;
  masaTanamPerTahun: number;
  proyeksiPanen: number;
  satuan: string;
  keterangan: string;
}

export interface PeternakanRow {
  komoditas: string;
  luasUsaha: number;
  siklusBulan: number;
  siklusPerTahun: number;
  jumlah: number;
  satuan: string;
  keterangan: string;
}

export interface AkademikRow {
  no: number;
  nama: string;
  dosenPembimbing: string;
  programStudi: string;
  tanggalMulai: string;   // ISO datetime
  tanggalSelesai: string; // ISO datetime
  luasan: number;
  judulPenelitian: string;
}

export interface KonservasiHewanRow {
  jenisSatwa: string;
  foto: string;
  jumlah: number;
  satuan: string;
  keterangan: string;
}

export interface ListParams {
  offset?: number;
  limit?: number;
  search?: string;
}

const toQuery = (p: ListParams) => ({
  offset: p.offset,
  limit: p.limit,
  search: p.search,
});

export const fetchPertanian = (p: ListParams = {}) =>
  request<PageContainer<PertanianRow>>("/public/pertanian", {
    query: toQuery(p),
  });

export const fetchPeternakan = (p: ListParams = {}) =>
  request<PageContainer<PeternakanRow>>("/public/peternakan", {
    query: toQuery(p),
  });

export const fetchAkademik = (p: ListParams = {}) =>
  request<PageContainer<AkademikRow>>("/public/akademik", {
    query: toQuery(p),
  });

export const fetchKonservasiHewan = (p: ListParams = {}) =>
  request<PageContainer<KonservasiHewanRow>>("/public/konservasi/hewan", {
    query: toQuery(p),
  });

export interface KemitraanStats {
  totalMitra: number;
  totalKolaborasi: number;
  activeMitra: Array<{
    nama: string;
    bidang: string;
    tanggalSelesai: string | null;
  }>;
}

export const fetchKemitraanStats = () =>
  request<KemitraanStats>("/public/kemitraan/stats");
