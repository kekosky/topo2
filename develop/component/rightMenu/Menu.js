module.exports = Menu;//菜单对象
function Menu(dom) {
    var self = this;
    self.body = $("<ul class='dropdown-menu'></ul>");
    dom.append(this.body);
    self.item = [];
}
//只调用一次，绑定父菜单切换
Menu.prototype.init = function (scene) {
    var self = this;
    self.scene = scene;
    //显示

    scene.on("mouseup", function (e, qtopo) {
        if (e.button == 2) {
            self.body.css({
                left: e.pageX - 20,
                top: e.pageY - 20
            }).show();
            self.x = e.x;
            self.y = e.y;
            //按钮的事件需要知道触发的对象
            if (qtopo) {
                self.target = qtopo;
            } else {
                self.target = scene;
            }
            showItem(self, self.item, self.target);
        }
    });
    //隐藏
    self.body.on('mouseleave mouseup click', function (e) {
        e.stopPropagation();
        self.body.hide();
    });
};
/*
 * 在菜单中添加子栏目
 * @param options 应包含name 菜单名,可选：click点击后处理事件filter 过滤条件
 */
Menu.prototype.addItem = function (options) {
    if (options) {
        var item = $("<li><a>" + options.name + "</a></li>");
        item.click(function (e) {
            e.stopPropagation();
            if ($.isFunction(options.click)) {
                options.click(e);
            }
        });
        this.body.append(item);
        this.item.push({
            body: item,
            type: 'item',
            order:options.order,
            name: options.name,
            filter: options.filter
        });
        return item;
    }
};
/*
 * 在菜单中添加子菜单栏,返回新Menu对象，可迭代添加
 * @param options 应包含name 菜单名，可选：click点击后处理事件filter 过滤条件
 * @returns {Menu}
 */
Menu.prototype.addSubMenu = function (options) {
    if (options) {
        var item = $("<li class='subMenu'><a>" + options.name + "</a></li>");
        item.click(function (e) {
            e.stopPropagation();
            if ($.isFunction(options.click)) {
                options.click(e);
            }
        });
        var subMenu = new Menu(item);
        this.body.append(item);
        this.item.push({
            body: item,
            subMenu: subMenu,
            type: 'subMenu',
            order:options.order,
            name: options.name,
            filter: options.filter
        });
        return subMenu;
    }
};
/*
 * 过滤显示的菜单栏
 * @param parent 菜单栏的父菜单
 * @param array 保存的菜单栏列表
 * @param target 触发的对象
 */
function showItem(parent, array, target) {
    parent.showedChild = 0;
    $.each(array, function (i, v) {
        switch (v.type) {
            case'item':
                if ($.isFunction(v.filter)) {
                    if (v.filter(target)) {
                        v.body.show();
                        parent.showedChild++;
                    } else {
                        v.body.hide();
                    }
                } else {
                    parent.showedChild++;
                    v.body.show();
                }
                break;
            case'subMenu':
                if ($.isFunction(v.filter)) {
                    if (v.filter(target)) {
                        v.body.show();
                        parent.showedChild++;
                        showItem(v, v.subMenu.item, target);//递归子项
                    } else {
                        v.body.hide();
                    }
                } else {
                    showItem(v, v.subMenu.item, target);//递归子项
                    if (v.showedChild == 0) {
                        v.body.hide();
                    } else {
                        v.body.show();
                        parent.showedChild++;
                    }
                }
                break;
        }
    });
}
