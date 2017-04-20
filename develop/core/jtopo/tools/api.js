/**
 * 绘制园角矩形
 * @param x {number}左上角坐标点x
 * @param y {number}左上角坐标点y
 * @param width {number}矩形宽度
 * @param height {number}矩形高度
 * @param borderRadius {number}圆角弧度
 */
CanvasRenderingContext2D.prototype._roundRect = function (x, y, width, height, borderRadius) {
    //元素圆角
    borderRadius = borderRadius || 5;
    this.beginPath();
    this.moveTo(x + borderRadius, y);
    this.lineTo(x + width - borderRadius, y);
    this.arcTo(x + width, y, x + width, y + borderRadius,borderRadius);
    this.lineTo(x + width, y + height - borderRadius);
    this.arcTo(x + width, y + height, x + width - borderRadius, y + height,borderRadius);
    this.lineTo(x + borderRadius, y + height);
    this.arcTo(x, y + height, x, y + height - borderRadius,borderRadius);
    this.lineTo(x, y + borderRadius);
    this.arcTo(x, y, x + borderRadius, y,borderRadius);
    this.closePath();
};
/**
 * 绘制椭圆
 * @param x {number}圆心坐标x
 * @param y {number}圆心坐标y
 * @param width {number}椭圆宽度
 * @param height {number}椭圆高度
 */
CanvasRenderingContext2D.prototype._ellipse = function (x, y, width, height) {
    var radiusX = width / 0.75 / 2;
    var radiusY = height / 2;
    this.beginPath();
    this.moveTo(x, y - radiusY);
    this.bezierCurveTo(x + radiusX, y - radiusY, x + radiusX, y + radiusY, x, y + radiusY);//右半边
    this.bezierCurveTo(x - radiusX, y + radiusY, x - radiusX, y - radiusY, x, y - radiusY);//左半边
    this.closePath();
};
/**
 * 画五角星
 * @param x {number}圆心坐标x
 * @param y {number}圆心坐标y
 * @param radius {number}五角星外半径
 * @private
 */
CanvasRenderingContext2D.prototype._star = function (x, y,radius) {
    var innerRadius=radius*0.4;
    this.beginPath();
    //从顶点开始绘制路径
    for (var i = 0; i < 5; i++) {
        this.lineTo(
            Math.cos((18 + i * 72) / 180 * Math.PI) * radius + x,
            -Math.sin((18 + i * 72) / 180 * Math.PI) * radius + y
        );
        this.lineTo(
            Math.cos((54 + i * 72) / 180 * Math.PI) * innerRadius + x,
            -Math.sin((54 + i * 72) / 180 * Math.PI) * innerRadius + y
        );
    }
    this.closePath();
};