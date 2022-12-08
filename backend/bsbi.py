import os
import math
import pickle

from google.cloud import storage

from index import InvertedIndex
from util import IdMap, preprocess_text

storage_client = storage.Client()
bucket = storage_client.bucket("gcf-sources-436560475999-asia-southeast2")


class BSBIIndex:
    """
    Attributes
    ----------
    term_id_map(IdMap): Untuk mapping terms ke termIDs
    doc_id_map(IdMap): Untuk mapping relative paths dari dokumen (misal,
                    /collection/0/gamma.txt) to docIDs
    output_dir(str): Path ke output index files
    index_name(str): Nama dari file yang berisi inverted index
    postings_encoding: Lihat di compression.py, kandidatnya adalah StandardPostings,
                    VBEPostings, dsb.
    """

    def __init__(self, output_dir, postings_encoding, index_name="main_index"):
        self.term_id_map = IdMap()
        self.doc_id_map = IdMap()
        self.output_dir = output_dir
        self.index_name = index_name
        self.postings_encoding = postings_encoding

    def load(self):
        """Memuat doc_id_map and term_id_map dari output directory"""

        with bucket.blob(os.path.join(self.output_dir, 'terms.dict')).open('rb') as f:
            self.term_id_map = pickle.load(f)
        with bucket.blob(os.path.join(self.output_dir, 'docs.dict')).open('rb') as f:
            self.doc_id_map = pickle.load(f)

    def retrieve_bm25(self, query, k=10, k1=1.5, b=0.75):
        """
        Melakukan Ranked Retrieval dengan skema TaaT (Term-at-a-Time) menggunakan BM25.
        """
        # Load term_id_map dan doc_id_map
        self.load()

        # Struktur: { doc_name: score }
        scores = {}
        query = preprocess_text(query)

        with InvertedIndex(self.index_name, self.postings_encoding, directory=self.output_dir) as index:
            for word in query:
                if word not in self.term_id_map:
                    continue
                term_id = self.term_id_map[word]

                # IDF = log (N / df(t))
                idf_score = math.log(
                    len(index.doc_length) / index.postings_dict[term_id][1])

                postings_list = index.get_postings_list(term_id)
                for i in range(len(postings_list[0])):
                    doc_id, tf = postings_list[0][i], postings_list[1][i]
                    doc_name = self.doc_id_map[doc_id]

                    # Formula Okapi BM25
                    bm25_score = idf_score
                    bm25_score *= (tf * (k1 + 1))
                    bm25_score /= (k1 * ((1 - b) + b *
                                   (index.doc_length[doc_id] / index.avg_doc_length)) + tf)

                    if doc_name not in scores:
                        scores[doc_name] = 0

                    scores[doc_name] = scores[doc_name] + bm25_score

        # Sort berdasarkan nilai score, ubah urutan nama dan skor
        return [(doc_name, score) for (score, doc_name) in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]]
