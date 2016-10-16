cc.Class({
    extends: cc.Component,

    properties: {
        rootBoneName:{
            default:"root",
            displayName:"根骨骼",
            tooltip:"根骨骼名字"
        },
        boneName:{
            default:"",
            displayName:"骨骼",
            tooltip:"包围盒绑定骨骼名字"
        },
        soltName:{
            default:"",
            displayName:"插槽",
            tooptip:"包围盒绑定的插槽名"
        },
        BoundingBoxName:{
            default:"",
            displayName:"包围盒",
            tooptip:"包围盒名字"
        },
        tag:{
            default:0,
            type: cc.Integer
        },
        _BoundingBox:null


    },
    editor: {
        requireComponent: sp.Skeleton
    },


    // use this for initialization
    onLoad: function () {
        var spine = this.getComponent(sp.Skeleton);
        this.spine = spine;
        this.collider = this.node.addComponent(cc.PolygonCollider);
        this.bone = this.spine.findBone(this.boneName);
        this.rootBone = this.spine.findBone(this.rootBoneName);
        this._BoundingBox = this.spine.getAttachment(this.soltName,this.BoundingBoxName);
        this.initColler();
    },
    initColler: function() {
        var vertices = this._BoundingBox.vertices;
        var points = this.collider.points;
        points.splice(0,points.length);
        for (var i = 0; i < vertices.length; i+=2) {
            points.push(cc.v2(vertices[i], vertices[i+1]));
        }
        this.collider.offset.x = this.bone.x - this.rootBone.x;
        this.collider.offset.y = this.bone.y - this.rootBone.y;
        this.collider.tag = this.tag;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.collider.offset.x = this.bone.x - this.rootBone.x;
        this.collider.offset.y = this.bone.y - this.rootBone.y;
        this.transformCollider();
    },

    transformCollider: function() {
        var vertices = this._BoundingBox.vertices;
        var points = this.collider.points;
        var rotat = Math.PI*this.bone.worldRotation/180;
        for (var i = 0; i < points.length; i++) {
            var x = vertices[i*2] * this.bone.worldScaleX;
            var y = vertices[i*2+1] * this.bone.worldScaleY;
            var dx = x * Math.cos(rotat) - y * Math.sin(rotat);
            var dy = x * Math.sin(rotat) + y * Math.cos(rotat);
            points[i].x = dx;
            points[i].y = dy;
        }
    }
});
