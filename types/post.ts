export type Post = {
  id: string;
  title: string;
  body: {
    petani: string;
    koperasi: string;
    tanggal_panen: string;
    pengepul: string;
    retail: string;
    lokasi: string;
    nama_kebun: string;
    pupuk_pestisida: string[];
  };
};
