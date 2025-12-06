"""
Post-processing script for 3D meshes using trimesh.
Handles cleanup and conversion to GLB.
"""

import trimesh
import os
import sys
import glob

def clean_mesh(input_obj: str, output_obj: str) -> str:
    """
    Clean up the mesh: remove duplicates, degenerate faces, and unreferenced vertices.
    """
    print(f"Cleaning mesh: {input_obj}")
    # Load mesh
    # force='mesh' ensures we get a Trimesh object, not a Scene
    mesh = trimesh.load(input_obj, force='mesh')
    
    # Basic cleanup operations
    # process=True (default in load) already does some, but we can be explicit
    mesh.process() 
    
    # Remove duplicate faces
    mesh.update_faces(mesh.unique_faces())
    
    # Remove degenerate faces (zero area)
    mesh.update_faces(mesh.nondegenerate_faces())
    
    # Remove vertices not referenced by any face
    mesh.remove_unreferenced_vertices()
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_obj), exist_ok=True)
    
    # Export
    mesh.export(output_obj)
    print(f"Cleaned mesh saved to: {output_obj}")
    return output_obj

def convert_to_glb(input_obj: str, output_glb: str) -> str:
    """
    Convert OBJ to GLB (binary glTF), which is better for web/AR.
    """
    print(f"Converting to GLB: {input_obj}")
    mesh = trimesh.load(input_obj, force='mesh')
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    
    mesh.export(output_glb)
    print(f"GLB saved to: {output_glb}")
    return output_glb

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, help="Path to input mesh")
    args = parser.parse_args()
    
    input_path = args.input
    
    if not input_path:
        # Find the most recent mesh in outputs/shape_meshes or outputs/raw_meshes
        # We look for mesh.obj or mesh_*.obj recursively
        # shape_meshes might be flat or nested
        shape_meshes = glob.glob('outputs/shape_meshes/**/*.obj', recursive=True)
        raw_meshes = glob.glob('outputs/raw_meshes/**/*.obj', recursive=True)
        
        all_meshes = shape_meshes + raw_meshes
        
        # Filter out already cleaned meshes to avoid loops if re-running
        all_meshes = [m for m in all_meshes if "_cleaned" not in m]
        
        if not all_meshes:
            print("No meshes found to post-process.")
            sys.exit(1)
            
        input_path = max(all_meshes, key=os.path.getctime)
        print(f"No input provided. Using latest found: {input_path}")

    # Define output paths
    # We want to save to outputs/processed_meshes/<parent_folder_name>/
    # e.g. outputs/processed_meshes/img_20251206_003056/
    
    # Get the parent folder name of the input file (e.g. img_20251206_003056)
    parent_folder_name = os.path.basename(os.path.dirname(input_path))
    
    # If the parent folder is just "0" (TripoSR subfolder), go up one more level
    if parent_folder_name == "0":
        parent_folder_name = os.path.basename(os.path.dirname(os.path.dirname(input_path)))

    output_dir = os.path.join("outputs", "processed_meshes", parent_folder_name)
    os.makedirs(output_dir, exist_ok=True)

    basename = os.path.splitext(os.path.basename(input_path))[0]
    
    cleaned_path = os.path.join(output_dir, f"{basename}_cleaned.obj")
    glb_path = os.path.join(output_dir, f"{basename}.glb")
    
    # Run pipeline
    try:
        clean_mesh(input_path, cleaned_path)
        convert_to_glb(cleaned_path, glb_path)
        print("Post-processing complete.")
    except Exception as e:
        print(f"Error during post-processing: {e}")


