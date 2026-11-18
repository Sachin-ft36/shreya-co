import json
import struct
import math
import os

def create_ocean_vibe_glb(png_path, glb_path):
    with open(png_path, 'rb') as f:
        png_bytes = f.read()

    # Grid resolution for 3D curved mesh
    # 80 x 80 provides very smooth curvature without being heavy (< 500KB geometry)
    nx_divs = 80
    ny_divs = 80

    w_size = 2.1
    h_size = 2.05
    half_thick = 0.025 # 5cm scale thickness in jewelry viewport

    # Generate vertices, normals, and uvs for front and back faces
    positions = []
    normals = []
    uvs = []
    indices = []

    def get_z_curve(norm_x, norm_y):
        # Natural 3D drape curve of a necklace hanging on a bust
        # norm_x is -1 to 1, norm_y is 1 (top) to -1 (bottom)
        # Top ends curve backwards around neck; pendant curves forward
        arch = (norm_x * 0.95) ** 2
        drape = 0.32 * arch - 0.12 * (norm_y)
        return -drape

    # --- FRONT FACE ---
    front_start_idx = 0
    for j in range(ny_divs + 1):
        v = j / ny_divs
        norm_y = 1.0 - 2.0 * v
        y = (norm_y * h_size * 0.5) + 0.05
        for i in range(nx_divs + 1):
            u = i / nx_divs
            norm_x = 2.0 * u - 1.0
            x = norm_x * w_size * 0.5
            base_z = get_z_curve(norm_x, norm_y)
            z = base_z + half_thick

            positions.extend([x, y, z])
            # Normal calculation: pointing slightly outwards/forward
            nx = norm_x * 0.3
            ny = 0.1
            nz = 1.0
            length = math.sqrt(nx*nx + ny*ny + nz*nz)
            normals.extend([nx/length, ny/length, nz/length])
            uvs.extend([u, v])

    # Front indices
    row_stride = nx_divs + 1
    for j in range(ny_divs):
        for i in range(nx_divs):
            p0 = front_start_idx + j * row_stride + i
            p1 = p0 + 1
            p2 = p0 + row_stride
            p3 = p2 + 1
            indices.extend([p0, p2, p1, p1, p2, p3])

    # --- BACK FACE (Opposite orientation, mirrored UV so texture looks correct from behind) ---
    back_start_idx = len(positions) // 3
    for j in range(ny_divs + 1):
        v = j / ny_divs
        norm_y = 1.0 - 2.0 * v
        y = (norm_y * h_size * 0.5) + 0.05
        for i in range(nx_divs + 1):
            u = i / nx_divs
            norm_x = 2.0 * u - 1.0
            x = norm_x * w_size * 0.5
            base_z = get_z_curve(norm_x, norm_y)
            z = base_z - half_thick

            positions.extend([x, y, z])
            # Normal points backwards
            nx = -norm_x * 0.3
            ny = -0.1
            nz = -1.0
            length = math.sqrt(nx*nx + ny*ny + nz*nz)
            normals.extend([nx/length, ny/length, nz/length])
            # Mirrored U for correct back view
            uvs.extend([1.0 - u, v])

    # Back indices (reverse winding order so backface culling works)
    for j in range(ny_divs):
        for i in range(nx_divs):
            p0 = back_start_idx + j * row_stride + i
            p1 = p0 + 1
            p2 = p0 + row_stride
            p3 = p2 + 1
            indices.extend([p0, p1, p2, p1, p3, p2])

    # Compute bounding box
    min_pos = [min(positions[i::3]) for i in range(3)]
    max_pos = [max(positions[i::3]) for i in range(3)]

    # Binary buffers
    pos_bytes = struct.pack(f'<{len(positions)}f', *positions)
    norm_bytes = struct.pack(f'<{len(normals)}f', *normals)
    uv_bytes = struct.pack(f'<{len(uvs)}f', *uvs)
    idx_bytes = struct.pack(f'<{len(indices)}I', *indices)

    # Align each bufferView to 4 bytes
    def pad4(b):
        pad = (4 - (len(b) % 4)) % 4
        return b + b'\x00' * pad

    padded_pos = pad4(pos_bytes)
    padded_norm = pad4(norm_bytes)
    padded_uv = pad4(uv_bytes)
    padded_idx = pad4(idx_bytes)
    padded_png = pad4(png_bytes)

    # Offsets in single BIN buffer
    offset = 0
    pos_offset = offset; offset += len(padded_pos)
    norm_offset = offset; offset += len(padded_norm)
    uv_offset = offset; offset += len(padded_uv)
    idx_offset = offset; offset += len(padded_idx)
    png_offset = offset; offset += len(padded_png)

    bin_data = padded_pos + padded_norm + padded_uv + padded_idx + padded_png

    # Construct glTF JSON structure
    gltf = {
        "asset": {
            "version": "2.0",
            "generator": "Shreya&Co 3D Atelier Engine"
        },
        "scene": 0,
        "scenes": [
            {
                "nodes": [0]
            }
        ],
        "nodes": [
            {
                "name": "OceanVibeNecklace",
                "mesh": 0
            }
        ],
        "meshes": [
            {
                "name": "Necklace3DMesh",
                "primitives": [
                    {
                        "attributes": {
                            "POSITION": 0,
                            "NORMAL": 1,
                            "TEXCOORD_0": 2
                        },
                        "indices": 3,
                        "material": 0
                    }
                ]
            }
        ],
        "materials": [
            {
                "name": "OceanVibeJewelryMaterial",
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 0
                    },
                    "metallicFactor": 0.85,
                    "roughnessFactor": 0.22
                },
                "alphaMode": "MASK",
                "alphaCutoff": 0.05,
                "doubleSided": False
            }
        ],
        "textures": [
            {
                "sampler": 0,
                "source": 0
            }
        ],
        "images": [
            {
                "bufferView": 4,
                "mimeType": "image/png",
                "name": "ocean-vibe-texture"
            }
        ],
        "samplers": [
            {
                "magFilter": 9729, # LINEAR
                "minFilter": 9987, # LINEAR_MIPMAP_LINEAR
                "wrapS": 33071,   # CLAMP_TO_EDGE
                "wrapT": 33071
            }
        ],
        "accessors": [
            {
                "bufferView": 0,
                "byteOffset": 0,
                "componentType": 5126, # FLOAT
                "count": len(positions) // 3,
                "type": "VEC3",
                "min": min_pos,
                "max": max_pos
            },
            {
                "bufferView": 1,
                "byteOffset": 0,
                "componentType": 5126, # FLOAT
                "count": len(normals) // 3,
                "type": "VEC3"
            },
            {
                "bufferView": 2,
                "byteOffset": 0,
                "componentType": 5126, # FLOAT
                "count": len(uvs) // 2,
                "type": "VEC2"
            },
            {
                "bufferView": 3,
                "byteOffset": 0,
                "componentType": 5125, # UNSIGNED_INT
                "count": len(indices),
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {
                "buffer": 0,
                "byteOffset": pos_offset,
                "byteLength": len(pos_bytes),
                "target": 34962 # ARRAY_BUFFER
            },
            {
                "buffer": 0,
                "byteOffset": norm_offset,
                "byteLength": len(norm_bytes),
                "target": 34962
            },
            {
                "buffer": 0,
                "byteOffset": uv_offset,
                "byteLength": len(uv_bytes),
                "target": 34962
            },
            {
                "buffer": 0,
                "byteOffset": idx_offset,
                "byteLength": len(idx_bytes),
                "target": 34963 # ELEMENT_ARRAY_BUFFER
            },
            {
                "buffer": 0,
                "byteOffset": png_offset,
                "byteLength": len(png_bytes)
            }
        ],
        "buffers": [
            {
                "byteLength": len(bin_data)
            }
        ]
    }

    json_str = json.dumps(gltf, separators=(',', ':'))
    json_bytes = json_str.encode('utf-8')
    # Pad JSON chunk to 4-byte boundary with spaces (0x20)
    json_pad = (4 - (len(json_bytes) % 4)) % 4
    json_bytes += b' ' * json_pad

    # GLB Header
    magic = 0x46546C67 # 'glTF'
    version = 2
    total_length = 12 + 8 + len(json_bytes) + 8 + len(bin_data)

    header = struct.pack('<III', magic, version, total_length)
    json_chunk_hdr = struct.pack('<II', len(json_bytes), 0x4E4F534A) # 'JSON'
    bin_chunk_hdr = struct.pack('<II', len(bin_data), 0x004E4942)   # 'BIN\0'

    os.makedirs(os.path.dirname(glb_path), exist_ok=True)
    with open(glb_path, 'wb') as f:
        f.write(header)
        f.write(json_chunk_hdr)
        f.write(json_bytes)
        f.write(bin_chunk_hdr)
        f.write(bin_data)

    print(f"GLB generated successfully: {glb_path} ({total_length} bytes)")

if __name__ == '__main__':
    create_ocean_vibe_glb('public/3d image/ocean vibe.png', 'public/models/ocean-vibe.glb')
