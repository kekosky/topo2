var util={
    getLinkNotThis:getLinkNotThis,
    getNums:getNums,
    linkArrow:linkArrow,
    getBorderPoint:getBorderPoint,
    makeQuadraticPoint:makeQuadraticPoint,
    isOverlay:isOverlay
};
module.exports=util;
function getLinksBetween(start, end) {
    var d = getPublicLink(start, end);
    var e = getPublicLink(end, start);
    return d.concat(e);
}
function getPublicLink(elementA, elementB) {
    var result = [];
    if (null == elementA || null == elementB)return result;
    if (elementA && elementB && elementA.outLinks && elementB.inLinks)
        for (var i = 0; i < elementA.outLinks.length; i++) {
            var outLink = elementA.outLinks[i];
            for (var f = 0; f < elementB.inLinks.length; f++) {
                var inlink = elementB.inLinks[f];
                if (outLink === inlink) {
                    result.push(inlink);
                }
            }
        }
    return result
}
/**
 * 获取两点之间线段的求y公式
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {getY}
 */
function lineF(x1, y1, x2, y2) {
    var tan = (y2 - y1) / (x2 - x1);
    var g = y1 - x1 * tan;
    getY.tan = tan;
    getY.b = g;
    getY.x1 = x1;
    getY.x2 = x2;
    getY.y1 = y1;
    getY.y2 = y2;
    return getY;
    function getY(x) {
        return x * tan + g
    }
}
function inRange(a1, a2, a3) {
    var d = Math.abs(a2 - a3);
    var e = Math.abs(a2 - a1);
    var f = Math.abs(a3 - a1);
    var g = Math.abs(d - (e + f));
    return 1e-6 > g ? !0 : !1
}
function isPointInLineSeg(x, y, fn) {
    return inRange(x, fn.x1, fn.x2) && inRange(y, fn.y1, fn.y2)
}
/**
 * 根据两条线的坐标公式查找交点
 * @param fnA
 * @param fnB
 * @returns {*}
 */
function intersection(fnA, fnB) {
    var x, y;
    if (fnA.tan != fnB.tan) {//夹角相同则存在两线共线
        if(1 / 0 == fnA.tan || fnA.tan == -1 / 0){//垂直时
            x = fnA.x1;
            y = fnB(fnA.x1);
        }else if(1 / 0 == fnB.tan || fnB.tan == -1 / 0){//垂直时
            x = fnB.x1;
            y = fnA(fnB.x1);
        }else{
            x = (fnB.b - fnA.b) / (fnA.tan - fnB.tan);
            y = fnA(x)
        }
        if(0!= isPointInLineSeg(x, y, fnA)&&0!= isPointInLineSeg(x, y, fnB)){
            return {
                x: x,
                y: y
            }
        }
    }
    return null;
}
/**
 * 获取直线公式与方形四条边的交点
 * @param lineFn
 * @param bound
 * @returns {{x, y}}
 */
function intersectionLineBound(lineFn, bound) {
    var newLineFn = lineF(bound.left, bound.top, bound.left, bound.bottom);
    var d = intersection(lineFn, newLineFn);
    if (null == d) {
        newLineFn = lineF(bound.left, bound.top, bound.right, bound.top);
        d = intersection(lineFn, newLineFn);
        if (null == d) {
            newLineFn = lineF(bound.right, bound.top, bound.right, bound.bottom);
            d = intersection(lineFn, newLineFn);
            if (null == d) {
                newLineFn = lineF(bound.left, bound.bottom, bound.right, bound.bottom);
                d = intersection(lineFn, newLineFn);
            }
        }
    }

    return d;
}







//--------------
function getLinkNotThis(link) {
    var b = getLinksBetween(link.nodeA, link.nodeZ);
    return b = b.filter(function (b) {
        return link !== b
    })
}
//--------------
function getNums(a, b) {
    return getLinksBetween(a, b).length
}
//--------------
function getBorderPoint(start, end) {
    var lineFn = lineF(start.cx, start.cy, end.cx, end.cy);
    var bound = start.getBound();
    return intersectionLineBound(lineFn, bound);
}
//---------------
function linkArrow(context, startPoint, endPoint, radius, offset, type) {
    var atanAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    var length = JTopo.util.getDistance(startPoint, endPoint) - radius;
    var COS = startPoint.x + (length + offset) * Math.cos(atanAngle);
    var SIN = startPoint.y + (length + offset) * Math.sin(atanAngle);
    var m = endPoint.x + offset * Math.cos(atanAngle);
    var n = endPoint.y + offset * Math.sin(atanAngle);
    atanAngle -= Math.PI / 2;
    var o = {
        x: COS + (radius / 2) * Math.cos(atanAngle),
        y: SIN + (radius / 2) * Math.sin(atanAngle)
    };
    var p = {
        x: COS + (radius / 2) * Math.cos(atanAngle - Math.PI),
        y: SIN + (radius / 2) * Math.sin(atanAngle - Math.PI)
    };
    context.moveTo(o.x, o.y);
    context.lineTo(m, n);
    context.lineTo(p.x, p.y);
    if (type) {
        context.fill();
    } else {
        context.stroke();
    }
}
//---------------
//制造一个二次贝塞尔曲线的阶段点
function makeQuadraticPoint(start, middle, end, time) {
    return {
        x: (1 - time) * (1 - time) * start.x + 2 * time * (1 - time) * middle.x + time * time * end.x,
        y: (1 - time) * (1 - time) * start.y + 2 * time * (1 - time) * middle.y + time * time * end.y
    }
}
//---------------
function isOverlay(nodeA,nodeZ){
    return ((nodeA.cx<nodeZ.x+nodeZ.width)&&(nodeA.cx>nodeZ.x))&&((nodeA.cy>nodeZ.y)&&(nodeA.cy)<nodeZ.y+nodeZ.height);
}
//---------------
