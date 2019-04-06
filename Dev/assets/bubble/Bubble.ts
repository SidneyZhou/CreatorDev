// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property, executeInEditMode} = cc._decorator;

export enum BubbleType {
    Label,
    Sprite,
}

@ccclass
@executeInEditMode
export default class Bubble extends cc.Component {

    @property(cc.Node)
    labelNode: cc.Node = null;

    @property
    _paddingTop: number = 0;
    @property({ step: 1, })
    get paddingTop() { return this._paddingTop; }
    set paddingTop(value) {
        this._paddingTop = value;
        this._doLayoutDirty();
    }

    @property
    _paddingBottom: number = 0;
    @property({ step: 1, })
    get paddingBottom() { return this._paddingBottom; }
    set paddingBottom(value) {
        this._paddingBottom = value;
        this._doLayoutDirty();
    }

    @property
    _paddingLeft: number = 0;
    @property({ step: 1, })
    get paddingLeft() { return this._paddingLeft; }
    set paddingLeft(value) {
        this._paddingLeft = value;
        this._doLayoutDirty();
    }

    @property
    _paddingRight: number = 0;
    @property({ step: 1, })
    get paddingRight() { return this._paddingRight; }
    set paddingRight(value) {
        this._paddingRight = value;
        this._doLayoutDirty();
    }

    _layoutDirty = true; // 是否绘制
    _layoutSize: cc.Size = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateLayout();
    }

    start () {
    }

    onEnable() {
        this._addEventListeners();

        this._doLayoutDirty();
    }

    onDisable() {
        this._removeEventListeners();
    }

    _doLayoutDirty() {
        this._layoutDirty = true;
    }

    _addEventListeners() {
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._resized, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.on(cc.Node.EventType.CHILD_REORDER, this._doLayoutDirty, this);
        this._addChildrenEventListeners();
    }

    _removeEventListeners() {
        cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._resized, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.off(cc.Node.EventType.CHILD_REORDER, this._doLayoutDirty, this);
        this._removeChildrenEventListeners();
    }

    _addChildrenEventListeners() {
        var children = this.node.children;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.on(cc.Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
            child.on(cc.Node.EventType.POSITION_CHANGED, this._doLayoutDirty, this);
            child.on(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
    }

    _removeChildrenEventListeners() {
        var children = this.node.children;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.off(cc.Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
            child.off(cc.Node.EventType.POSITION_CHANGED, this._doLayoutDirty, this);
            child.off(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
    }

    _doLayout() {
        this.labelNode.x = - this._paddingRight;
        this.labelNode.y = this.paddingBottom;

        let size = this.labelNode.getContentSize();
        this.node.setContentSize(new cc.Size(size.width + this.paddingLeft + this._paddingRight
            , size.height + this.paddingTop + this.paddingBottom));
    }

    updateLayout() {
        // cc.log('updateLayout', this._layoutDirty, this.node.children.length);
        if (this._layoutDirty && this.node.children.length > 0) {
            this._doLayout();
            this._layoutDirty = false;
        }
    }

    _resized () {
        this._layoutSize = this.node.getContentSize();
        this._doLayoutDirty();
    }

    // update (dt) {}
}
