"""
Script for validating generated meshes before delivery.
Checks geometry stats and integrity.
"""

import trimesh
import os
import sys
import json
import glob

def validate_mesh(mesh_path: str) -> dict:
    """
    Load mesh and gather stats (polycount, vertex count, integrity).
    """
    print(f"Validating mesh: {mesh_path}")
    
    try:
        mesh = trimesh.load(mesh_path, force='mesh')
    except Exception as e:
        return {"error": f"Failed to load mesh: {str(e)}"}

    report = {
        "filename": os.path.basename(mesh_path),
        "vertices": len(mesh.vertices),
        "faces": len(mesh.faces),
        "is_watertight": mesh.is_watertight,
        "is_winding_consistent": mesh.is_winding_consistent,
        "euler_number": mesh.euler_number,
        "volume": mesh.volume if mesh.is_watertight else None,
        "bounds": mesh.bounds.tolist() if hasattr(mesh.bounds, 'tolist') else mesh.bounds,
    }
    
    # Check for texture/visuals if it's a GLB or has texture
    if hasattr(mesh, 'visual') and mesh.visual.kind == 'texture':
        report["has_texture"] = True
    else:
        report["has_texture"] = False

    return report

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, help="Path to input mesh (OBJ or GLB)")
    args = parser.parse_args()
    
    input_path = args.input
    
    if not input_path:
        # Find the most recent GLB (final output)
        glbs = glob.glob('outputs/*.glb')
        if not glbs:
            # Fallback to cleaned OBJs
            glbs = glob.glob('outputs/shape_meshes/*/*_cleaned.obj')
            
        if not glbs:
            print("No meshes found to validate.")
            sys.exit(1)
            
        input_path = max(glbs, key=os.path.getctime)
        print(f"No input provided. Using latest found: {input_path}")

    stats = validate_mesh(input_path)
    print(json.dumps(stats, indent=2))



