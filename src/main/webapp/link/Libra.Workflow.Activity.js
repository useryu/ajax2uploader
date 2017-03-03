/*
 * 活动基类
 */
Libra.Workflow.Activity = Class.create(Libra.Workflow.Unit, {

    position: {x:0, y:0},

    initialize: function($super, options){
        $super(options);
        var _this = this;
        _this.position = options.position;

        _this.contextMenuItems = [];
        _this.contextMenuItems.push(new Libra.Workflow.ContextMenuExecuteItem({text: '新增条件转移', url: '1'}));
        _this.contextMenuItems.push(new Libra.Workflow.ContextMenuExecuteItem({text: '新增无条件转移', url: '2'}));
        _this.contextMenuItems.push(new Libra.Workflow.ContextMenuExecuteItem({text: '新增缺省转移', url: '3'}));
    },

    // 获取角点位置（从左上角开始0-7共8个点位）
    getAnglePosition: function(angleIndex){},

    // 创建图形配置项
    createShapeOptions: function($super){
        var _this = this,
            shapeOptions = $super();
        return Object.extend(shapeOptions, {
            style : {
                x : _this.position.x,
                y : _this.position.y,
                brushType : 'both',
                color : '#ccddff',
                strokeColor : '#999999',
                lineWidth : 2,
                text : _this.title,
                textPosition :'inside',
                textColor: '#333333'
            },
            draggable : true,

            ondragstart: function(params){ _this.graph.onActivityDragStart(_this); },
            ondragend: function(params){ _this.graph.onActivityDragEnd(_this); }
        });
    }
});

/*
 * 开始活动（圆形）
 */
Libra.Workflow.StartActivity = Class.create(Libra.Workflow.Activity, {

    shape: null,

    getAnglePosition: function(angleIndex){
        var position = this.shape.position,
            style = this.shape.style;
        var radian = 2 * Math.PI / 360 * ((angleIndex + 3) % 8) * 45;
        return {
            x: Math.round(style.x + position[0] + Math.sin(radian) * 30),
            y: Math.round(style.y + position[1] + Math.cos(radian) * 30)
        };
    },

    createCircleOptions: function(selected){
        var _this = this;
        var shapeOptions = _this.createShapeOptions();
        shapeOptions.style.r = 30;
        if(selected) shapeOptions.style.color = '#ff6633';
        return shapeOptions;
    },

    addTo: function(graph){
        var _this = this, shapeOptions = _this.createCircleOptions(false);
        var shape = new graph.type.Shape.Circle(shapeOptions);
        graph.addShape(shape);
        _this.shape = shape;
    },

    refresh: function(graph){
        var _this = this, shapeOptions = _this.createCircleOptions(_this.selected);
        _this.shape.style = shapeOptions.style;
        return [_this.shape];
    }
});


/*
 * 动作集活动（平行四边形）
 */
Libra.Workflow.ActionAssemblyActivity = Class.create(Libra.Workflow.Activity, {

    width: 110,
    height: 60,
    delta: 20,
    shape: null,

    buildPointList: function(width, height, delta){
        var position = this.position, x = position.x, y = position.y, halfHeight = height / 2, halfWidthDelta = (width + delta) / 2;
        var topLeft = [x - halfWidthDelta + delta, y - halfHeight],
            topRight = [x + halfWidthDelta, y - halfHeight],
            bottomRight = [x + halfWidthDelta - delta, y + halfHeight],
            bottomLeft = [x - halfWidthDelta, y + halfHeight];
        return [topLeft, topRight, bottomRight, bottomLeft];
    },

    getAnglePosition: function(angleIndex){
        var activity = this,
            position = activity.shape.position,
            style = activity.shape.style,
            x = style.x + position[0],
            y = style.y + position[1],
            halfWidth = activity.width / 2,
            halfWidthDelta = (activity.width + activity.delta) / 2,
            halfHeight = activity.height / 2,
            delta = activity.delta;
        switch(angleIndex){
            case 0:
                x = x - halfWidthDelta + delta;
                y = y - halfHeight;
                break;
            case 1:
                y = y - halfHeight;
                break;
            case 2:
                x = x + halfWidthDelta;
                y = y - halfHeight;
                break;
            case 3:
                x = x + halfWidth;
                break;
            case 4:
                x = x + halfWidthDelta - delta;
                y = y + halfHeight;
                break;
            case 5:
                y = y + halfHeight;
                break;
            case 6:
                x = x - halfWidthDelta;
                y = y + halfHeight;
                break;
            case 7:
                x = x - halfWidth;
                break;
        }
        return {x: x, y: y};
    },

    createPolygonOptions: function(selected){
        var activity = this;
        var shapeOptions = activity.createShapeOptions();
        shapeOptions.style.pointList = activity.buildPointList(activity.width, activity.height, activity.delta);
        if(selected) shapeOptions.style.color = '#ff6633';
        return shapeOptions;
    },

    addTo: function(graph){
        var activity = this, shapeOptions = activity.createPolygonOptions(false);
        var shape = new graph.type.Shape.Polygon(shapeOptions);
        graph.addShape(shape);
        activity.shape = shape;
    },

    refresh: function(graph){
        var _this = this, shapeOptions = _this.createPolygonOptions(_this.selected);
        _this.shape.style = shapeOptions.style;
        return [_this.shape];
    }
});



/*
 * 人工活动（圆角矩形）
 */
Libra.Workflow.ManualActivity = Class.create(Libra.Workflow.Activity, {

    width: 120,
    height: 70,
    shape: null,

    getAnglePosition: function(angleIndex){
        var activity = this,
            position = this.shape.position,
            style = this.shape.style,
            x = style.x + position[0],
            y = style.y + position[1],
            halfWidth = activity.width / 2,
            halfHeight = activity.height / 2;
        var offsets = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
        return {
            x: x + offsets[angleIndex][0] * halfWidth,
            y: y + offsets[angleIndex][1] * halfHeight
        };
    },

    createRectangleOptions: function(selected){
        var activity = this,
            position = activity.position;
            shapeOptions = activity.createShapeOptions(),
            style = shapeOptions.style;
        style.x = position.x - activity.width / 2;
        style.y = position.y - activity.height / 2;
        style.width = activity.width;
        style.height = activity.height;
        style.radius = [3];
        if(selected) shapeOptions.style.color = '#ff6633';
        return shapeOptions;
    },

    addTo: function(graph){
        var activity = this, shapeOptions = activity.createRectangleOptions(false);
        var shape = new graph.type.Shape.Rectangle(shapeOptions);
        graph.addShape(shape);
        activity.shape = shape;
    },

    refresh: function(graph){
        var _this = this, shapeOptions = _this.createRectangleOptions(_this.selected);
        _this.shape.style = shapeOptions.style;
        return [_this.shape];
    }
});