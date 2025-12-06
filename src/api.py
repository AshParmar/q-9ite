"""
FastAPI skeleton for the prompt-to-asset pipeline with an in-memory queue stub.
"""

from fastapi import FastAPI

# In-memory job store placeholders (e.g., dict of job_id -> status/result).
jobs = {}

# Placeholder queue for incoming jobs.
job_queue = []

# FastAPI application instance.
app = FastAPI(title="Game 3D Generator API", version="0.0.0")


def worker_loop():
    """
    Placeholder worker thread that would pull jobs from job_queue and run the pipeline.
    """
    # TODO: Run in a background thread.
    # TODO: Pop jobs from job_queue, update jobs status, and execute pipeline steps:
    #   - generate_image
    #   - image_to_mesh
    #   - post-processing (clean, decimate, LODs, convert_to_glb)
    #   - validation
    # TODO: Store outputs and validation results back into jobs store.
    raise NotImplementedError("Worker loop implementation goes here.")


@app.post("/generate")
def submit_generation(prompt: str, seed: int | None = None, steps: int = 20, guidance: float = 7.5):
    """
    Submit a new generation job.
    """
    # TODO: Create a job_id, enqueue job into job_queue, set initial status.
    # TODO: Optionally start worker thread if not running.
    # TODO: Return job_id to caller.
    raise NotImplementedError("Submit endpoint implementation goes here.")


@app.get("/status/{job_id}")
def get_status(job_id: str):
    """
    Retrieve job status and any available results.
    """
    # TODO: Lookup job_id in jobs store.
    # TODO: Return status, progress, and result URLs/paths if available.
    raise NotImplementedError("Status endpoint implementation goes here.")


