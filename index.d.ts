declare module "@propelleraero/dxf-writer" {
    export type Unit =
        | "Unitless"
        | "Inches"
        | "Feet"
        | "Miles"
        | "Millimeters"
        | "Centimeters"
        | "Meters"
        | "Kilometers"
        | "Microinches"
        | "Mils"
        | "Yards"
        | "Angstroms"
        | "Nanometers"
        | "Microns"
        | "Decimeters"
        | "Decameters"
        | "Hectometers"
        | "Gigameters"
        | "Astronomical units"
        | "Light years"
        | "Parsecs";

    export type HorizontalAlignment = "left" | "center" | "right";
    export type VerticalAlignment = "baseline" | "bottom" | "middle" | "top";

    export type Point2D = [number, number];
    export type Point3D = [number, number, number];

    // [GroupCode, value]
    export type HeaderValue = [number, number];

    export abstract class Taggable {
        tags(manager: TagsManager): Promise<void>;
    }

    export abstract class Block extends Taggable {
        constructor(name: string);
    }

    export abstract class Table extends Taggable {
        constructor(name: string);
        add(element: object): void;
    }

    export abstract class TagsManager {
        point(x: number, y: number, z?: number): Promise<void>;
        start(name: string): Promise<void>;
        end(): Promise<void>;
        addHeaderVariable(
            name: string,
            tagsElements: HeaderValue[]
        ): Promise<void>;
        push(code: string | number, value: string | number): Promise<void>;
        finaliseWriting(): Promise<void>;
    }

    export class Arc extends Taggable {
        public x1: number;
        public y1: number;
        public r: number;
        public startAngle: number;
        public endAngle: number;

        /**
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} r - radius
         * @param {number} startAngle - degree
         * @param {number} endAngle - degree
         */
        constructor(
            x1: number,
            y1: number,
            r: number,
            startAngle: number,
            endAngle: number
        );
    }

    export class Circle extends Taggable {
        public x1: number;
        public y1: number;
        public r: number;

        /**
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} r - radius
         */
        constructor(x1: number, y1: number, r: number);
    }

    export class Cylinder extends Taggable {
        public x1: number;
        public y1: number;
        public z1: number;
        public r: number;
        public thickness: number;
        public extrusionDirectionX: number;
        public extrusionDirectionY: number;
        public extrusionDirectionZ: number;

        /**
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} z1 - Center z
         * @param {number} r - radius
         * @param {number} thickness - thickness
         * @param {number} extrusionDirectionX - Extrusion Direction x
         * @param {number} extrusionDirectionY - Extrusion Direction y
         * @param {number} extrusionDirectionZ - Extrusion Direction z
         */
        constructor(
            x1: number,
            y1: number,
            z1: number,
            r: number,
            thickness: number,
            extrusionDirectionX: number,
            extrusionDirectionY: number,
            extrusionDirectionZ: number
        );
    }

    export class Face extends Taggable {
        public x1: number;
        public y1: number;
        public z1: number;
        public x2: number;
        public y2: number;
        public z2: number;
        public x3: number;
        public y3: number;
        public z3: number;
        public x4: number;
        public y4: number;
        public z4: number;

        constructor(
            x1: number,
            y1: number,
            z1: number,
            x2: number,
            y2: number,
            z2: number,
            x3: number,
            y3: number,
            z3: number,
            x4: number,
            y4: number,
            z4: number
        );
    }

    export class Layer extends Taggable {
        public name: string;
        public colorNumber: number;
        public lineTypeName: string;
        public shapes: RenderableToDxf[];
        public trueColor: number;

        constructor(name: string, colorNumber: number, lineTypeName: string);

        setTrueColor(color: number): void;
        writeShapes(space: Block, manager: TagsManager, shape: Taggable): void;
    }

    export class Line extends Taggable {
        public x1: number;
        public y1: number;
        public x2: number;
        public y2: number;

        constructor(x1: number, y1: number, x2: number, y2: number);
    }

    export class LineType extends Taggable {
        public name: string;
        public description: string;
        public elements: Array<number>;
        /**
         * @param {string} name
         * @param {string} description
         * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
         */
        constructor(name: string, description: string, elements: Array<number>);
        getElementsSum(): number;
    }

    export class Point extends Taggable {
        public x: number;
        public y: number;

        constructor(x: number, y: number);
    }

    export class Polyline extends Taggable {
        public points: Array<Point2D>;

        constructor(points: Array<Point2D>);
    }

    export class Polyline3D extends Taggable {
        public points: Array<Point3D>;

        constructor(points: Array<Point3D>);
    }

    export class Text extends Taggable {
        public x1: number;
        public y1: number;
        public height: number;
        public rotation: number;
        public value: string;
        public horizontalAlignment: HorizontalAlignment;
        public verticalAlignment: VerticalAlignment;
        /**
         * @param {number} x1 - x
         * @param {number} y1 - y
         * @param {number} height - Text height
         * @param {number} rotation - Text rotation
         * @param {string} value - the string itself
         * @param {HorizontalAlignment} [horizontalAlignment="left"] left | center | right
         * @param {VerticalAlignment} [verticalAlignment="baseline"] baseline | bottom | middle | top
         */
        constructor(
            x1: number,
            y1: number,
            height: number,
            rotation: number,
            value: string,
            horizontalAlignment?: HorizontalAlignment,
            verticalAlignment?: VerticalAlignment
        );
    }

    export class Mesh extends Taggable {
        public vertices: Point3D[];
        public faceIndices: number[][];

        constructor(vertices: number[][], faceIndices: number[][]);
    }

    export type ACIKey =
        | "LAYER"
        | "RED"
        | "YELLOW"
        | "GREEN"
        | "CYAN"
        | "BLUE"
        | "MAGENTA"
        | "WHITE";

    export class StringWritableStream {
        constructor();
        addEventListener(
            event: "finish" | "error",
            callback: () => void
        ): void;
        removeEventListener(
            event: "finish" | "error",
            callback: () => void
        ): void;
        write(data: string | Uint8Array): boolean;
        end(): void;
        toString(): string;
    }
    export class BrowserFriendlyDrawing {
        constructor(stream: StringWritableStream);

        addBlock(name: string): Block;
        addLayer(
            name: string,
            colorNumber: number,
            lineTypeName: string
        ): StreamableDrawing;

        /**
         * @param {string} name
         * @param {string} description
         * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
         * @returns {StreamableDrawing}
         */
        addLineType(
            name: string,
            description: string,
            elements: Array<number>
        ): StreamableDrawing;

        addTable(name: string): Table;

        /**
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} r - radius
         * @param {number} startAngle - degree
         * @param {number} endAngle - degree
         * @returns {Promise<StreamableDrawing>}
         */
        drawArc(
            x1: number,
            y1: number,
            r: number,
            startAngle: number,
            endAngle: number
        ): Promise<StreamableDrawing>;

        /**
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} r - radius
         * @returns {Promise<StreamableDrawing>}
         */
        drawCircle(
            x1: number,
            y1: number,
            r: number
        ): Promise<StreamableDrawing>;

        /**
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} z1 - Center z
         * @param {number} r - radius
         * @param {number} thickness - thickness
         * @param {number} extrusionDirectionX - Extrusion Direction x
         * @param {number} extrusionDirectionY - Extrusion Direction y
         * @param {number} extrusionDirectionZ - Extrusion Direction z
         * @returns {Promise<StreamableDrawing>}
         */
        drawCylinder(
            x1: number,
            y1: number,
            z1: number,
            r: number,
            thickness: number,
            extrusionDirectionX: number,
            extrusionDirectionY: number,
            extrusionDirectionZ: number
        ): Promise<StreamableDrawing>;

        /**
         * Draw an ellipse.
         * @param {number} x1 - Center x
         * @param {number} y1 - Center y
         * @param {number} majorAxisX - Endpoint x of major axis, relative to center
         * @param {number} majorAxisY - Endpoint y of major axis, relative to center
         * @param {number} axisRatio - Ratio of minor axis to major axis
         * @param {number | undefined} startAngle - Start angle
         * @param {number | undefined} endAngle - End angle
         * @returns {Promise<StreamableDrawing>}
         */
        drawEllipse(
            x1: number,
            y1: number,
            majorAxisX: number,
            majorAxisY: number,
            axisRatio: number,
            startAngle?: number,
            endAngle?: number
        ): Promise<StreamableDrawing>;

        drawFace(
            x1: number,
            y1: number,
            z1: number,
            x2: number,
            y2: number,
            z2: number,
            x3: number,
            y3: number,
            z3: number,
            x4: number,
            y4: number,
            z4: number
        ): Promise<StreamableDrawing>;

        drawLine(
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ): Promise<StreamableDrawing>;

        /**
         * @param {number} x1
         * @param {number} y1
         * @param {number} z1
         * @param {number} x2
         * @param {number} y2
         * @param {number} z2
         * @returns {Promise<StreamableDrawing>}
         */
        drawLine3d(
            x1: number,
            y1: number,
            z1: number,
            x2: number,
            y2: number,
            z2: number
        ): Promise<StreamableDrawing>;

        /**
         * @param {[number, number, number][]} vertices - Array of vertices like [ [x1, y1, z3], [x2, y2, z3]... ]
         * @param {number[][]} faceIndices - Array of face indices
         * @returns {Promise<StreamableDrawing>}
         */
        drawMesh(
            vertices: Point3D[],
            faceIndices: number[][]
        ): Promise<StreamableDrawing>;

        drawPoint(x: number, y: number): Promise<StreamableDrawing>;

        /**
         * Draw a regular convex polygon as a polyline entity.
         *
         * @see [Regular polygon | Wikipedia](https://en.wikipedia.org/wiki/Regular_polygon)
         *
         * @param {number} x - The X coordinate of the center of the polygon.
         * @param {number} y - The Y coordinate of the center of the polygon.
         * @param {number} numberOfSides - The number of sides.
         * @param {number} radius - The radius.
         * @param {number} rotation - The  rotation angle (in Degrees) of the polygon. By default 0.
         * @param {boolean} circumscribed - If `true` is a polygon in which each side is a tangent to a circle.
         * If `false` is a polygon in which all vertices lie on a circle. By default `false`.
         *
         * @returns {Promise<StreamableDrawing>}
         */
        drawPolygon(
            x: number,
            y: number,
            numberOfSides: number,
            radius: number,
            rotation?: number,
            circumscribed?: boolean
        ): Promise<StreamableDrawing>;

        /**
         * @param {array} points - Array of points like [ [x1, y1], [x2, y2]... ]
         * @param {boolean} closed - Closed polyline flag
         * @param {number} startWidth - Default start width
         * @param {number} endWidth - Default end width
         * @returns {Promise<StreamableDrawing>}
         */
        drawPolyline(
            points: Array<Point2D>,
            closed?: boolean,
            startWidth?: number,
            endWidth?: number
        ): Promise<StreamableDrawing>;

        /**
         * @param {array} points - Array of points like [ [x1, y1, z1], [x2, y2, z1]... ]
         * @returns {Promise<StreamableDrawing>}
         */
        drawPolyline3d(points: Array<Point3D>): Promise<StreamableDrawing>;

        /**
         * draws a closed rectangular polyline with option for round or diagonal corners
         * @param {number} x1
         * @param {number} y1
         * @param {number} x2
         * @param {number} y2
         * @param {number} cornerLength given P (the 90deg corner point), and P1 (the point where arc begins), where cornerLength is the length of P to P1
         * @param {number} cornerBulge defaults to 0, for diagonal corners
         * @returns {Promise<StreamableDrawing>}
         */
        drawRect(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            cornerLength?: number,
            cornerBulge?: number
        ): Promise<StreamableDrawing>;

        /**
         * Draw a spline.
         * @param {[Array]} controlPoints - Array of control points like [ [x1, y1], [x2, y2]... ]
         * @param {number | undefined} degree - Degree of spline: 2 for quadratic, 3 for cubic. Default is 3
         * @param {[number] | undefined} knots - Knot vector array. If null, will use a uniform knot vector. Default is null
         * @param {[number] | undefined} weights - Control point weights. If provided, must be one weight for each control point. Default is null
         * @param {[Array] | undefined} fitPoints - Array of fit points like [ [x1, y1], [x2, y2]... ]
         * @returns {Promise<StreamableDrawing>}
         */
        drawSpline(
            controlPoints: Array<Point2D>,
            degree?: number,
            knots?: number[],
            weights?: number[],
            fitPoints?: Array<Point2D>
        ): Promise<StreamableDrawing>;

        /**
         * @param {number} x1 - x
         * @param {number} y1 - y
         * @param {number} height - Text height
         * @param {number} rotation - Text rotation
         * @param {string} value - the string itself
         * @param {HorizontalAlignment} [horizontalAlignment="left"] left | center | right
         * @param {VerticalAlignment} [verticalAlignment="baseline"] baseline | bottom | middle | top
         * @returns {Promise<StreamableDrawing>}
         */
        drawText(
            x1: number,
            y1: number,
            height: number,
            rotation: number,
            value: string,
            horizontalAlignment?: HorizontalAlignment,
            verticalAlignment?: VerticalAlignment
        ): Promise<StreamableDrawing>;

        /**
         * @param {number} x1 - x
         * @param {number} y1 - y
         * @param {number} z1 - z
         * @returns {Promise<StreamableDrawing>}
         */
        drawVertex(
            x1: number,
            y1: number,
            z1: number
        ): Promise<StreamableDrawing>;

        end(): Promise<void>;

        /**
         * @see https://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
         * @see https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
         *
         * @param {string} variable
         * @param {array} values Array of "two elements arrays". [  [value1_GroupCode, value1_value], [value2_GroupCode, value2_value]  ]
         * @returns {StreamableDrawing}
         *
         */
        header(variable: string, values: Array<HeaderValue>): StreamableDrawing;

        setActiveLayer(name: string): StreamableDrawing;

        /**
         * @param {number} trueColor - Integer representing the true color, can be passed as an hexadecimal value of the form 0xRRGGBB
         * @returns {StreamableDrawing}
         */
        setTrueColor(trueColor: number): StreamableDrawing;

        /**
         *
         * @param {string} unit see Drawing.UNITS
         * @returns {StreamableDrawing}
         */
        setUnits(unit: Unit): StreamableDrawing;

        /**
         * AutoCAD Color Index (ACI)
         * @see http://sub-atomic.com/~moses/acadcolors.html
         */
        static ACI: { [key in ACIKey]: number };

        static LINE_TYPES: LineType[];

        static LAYERS: Layer[];

        /**
         * @see https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
         */
        static UNITS: { [key in Unit]: number };
    }

    export class StreamableDrawing extends BrowserFriendlyDrawing {
        constructor(stream: NodeJS.WritableStream);
    }
}
