import time

from google.cloud import storage

from bsbi import BSBIIndex
from compression import VBEPostings

storage_client = storage.Client()
bucket = storage_client.bucket("gcf-sources-436560475999-asia-southeast2")


def search(request):
    query = request.args.get("q")
    if query == None:
        return "Please enter a search query", 400

    BSBI_instance = BSBIIndex(
        postings_encoding=VBEPostings, output_dir='index')

    start_time = time.time()
    ranking = BSBI_instance.retrieve_bm25(query, k=1000, k1=2, b=0.8)
    end_time = time.time()

    length = 0
    serp = []

    for (_, doc) in ranking:
        length += 1
        with bucket.blob(doc.replace("\\", "/")).open("r") as f:
            serp.append(f.read())

    return {"duration": end_time - start_time, "length": length, "serp": serp}, 200
