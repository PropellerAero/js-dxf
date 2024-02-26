class Mesh {
  /**
   * @param {array} vertices - Array of vertices like [ [x1, y1, z3], [x2, y2, z3]... ]
   * @param {array} faceIndices - Array of face indices like [ [v1, v2, v3]... ]
   */
  constructor(vertices, faceIndices) {
    this.vertices = vertices;
    this.faceIndices = faceIndices;
  }

  toDxfString() {
    // https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-4B9ADA67-87C8-4673-A579-6E4C76FF7025
    let s = `0\nMESH\n`;
    s += `8\n${this.layer.name}\n`;

    this.vertices.forEach(([x, y, z]) => {
      s += `10\n${x}\n20\n${y}\n30\n${z}\n`;
    });

    s += `93\n${Math.round(this.faceIndices.length)}\n`;

    this.faceIndices.forEach((indices) => {
      s += `90\n${indices.length}\n`;

      indices.forEach((index) => {
        s += `90\n${index}\n`;
      });
    });
    return s;
  }
}

module.exports = Mesh;
