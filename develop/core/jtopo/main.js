/**
 * Created by qiyc on 2017/4/12.
 */
function Element() {
    this.elementType = "element";
    this.serializedProperties = ["elementType"];
    this.propertiesStack = [];
}
Element.prototype.removeHandler = function () {
};
Element.prototype.attr = function (name, value) {
    if (null != name && null != value){
        this[name] = value;
    }else if (null != name){
        return this[name];
    }
    return this
};
Element.prototype.save = function () {
    var a = this;
    var b = {};
    this.serializedProperties.forEach(function (properties) {
        b[properties] = a[properties];
    });
    this.propertiesStack.push(b);
};
Element.prototype.restore = function () {
    if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
        var a = this, b = this.propertiesStack.pop();
        this.serializedProperties.forEach(function (c) {
            a[c] = b[c]
        })
    }
};
var JTopo = {
    version: "0.4.8_01",
    zIndex_Container: 1,
    zIndex_Link: 2,
    zIndex_Node: 3,
    SceneMode: {normal: "normal", drag: "drag", edit: "edit", select: "select"}
};
JTopo.Element = Element;
module.exports = JTopo;