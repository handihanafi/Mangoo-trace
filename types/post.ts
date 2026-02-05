export interface PostBody {
  petani: string;
  pengepul: string;
  koperasi: string;
  retail: string;
  lokasi: string;
  nama_kebun: string;
  tanggal_panen: string;
  pupuk_pestisida: string[];
}

export interface Post {
  id: string;
  userId: number;
  title: string;
  body: PostBody;
}
