/*
 * 连接弧基类
 */
Libra.Workflow.Transition = Class.create(Libra.Workflow.Unit,{

    from: null,
    // 起始活动角度（共八个角度）
    fromAngle: null,
    // 运行时，用于动态计算
    fromAngleRun: null,

    to: null,
    // 结束活动角度（共八个角度）
    toAngle: null,
    toAngleRun: null,

    polyline: null,
    arrow: null,
    circle:null,

    initialize: function($super, options){
        $super(options);
        var transition = this;
        transition.id = options.id;
        transition.from = options.from;
        transition.fromAngle = options.fromAngle;
        transition.to = options.to;
        transition.toAngle = options.toAngle;
        transition.title = options.title;
    },

    // 创建箭头配置项
    createPolylineOptions: function(graph, selected){

        var oddAngleDelta = 15;
        // 找出目标活动中离参照点最近的角点
        function findShortestAngle(referencePosition, targetActivity){
            var minAngleIndex = -1, minDistance = 0, minPosition = null;
            for(var angleIndex = 0; angleIndex < 8; angleIndex++){
                var targetPosition = targetActivity.getAnglePosition(angleIndex);
                distance = Math.sqrt(Math.pow(referencePosition.x - targetPosition.x, 2) + Math.pow(referencePosition.y - targetPosition.y, 2));
                if(minAngleIndex === -1 || distance < minDistance || (Math.abs(distance - minDistance) < oddAngleDelta && (angleIndex % 2 === 1))){
                    // 差距不大时，基数角点优先
                    minAngleIndex = angleIndex;
                    minDistance = distance;
                    minPosition = targetPosition;
                }
            }
            return {angleIndex:minAngleIndex, distance:minDistance, position:minPosition};
        }

        // 找出两个活动中距离最近的两个角点
        function findShortestAngle2(activity1, activity2){
            var minAngleIndex = -1, minDistance = 0, minPosition = null, angle2 = null;
            for(var angleIndex1 = 0; angleIndex1 < 8; angleIndex1++){
                var activity1Position = activity1.getAnglePosition(angleIndex1);
                var shortest = findShortestAngle(activity1Position, activity2);
                if(minAngleIndex === -1 || shortest.distance < minDistance || (Math.abs(shortest.distance - minDistance) < oddAngleDelta && (angleIndex1 % 2 === 1))){
                    minAngleIndex = angleIndex1;
                    minDistance = shortest.distance;
                    minPosition = activity1Position;
                    angle2 = shortest;
                }
            }
            return [{angleIndex:minAngleIndex, position:minPosition, distance:minDistance}, angle2];
        }

        var transition = this,
            fromActivity = graph.getActivity(transition.from),
            toActivity = graph.getActivity(transition.to),
            fromPosition, toPosition;
        if(transition.fromAngle < 0 || transition.fromAngle > 7){
            if(transition.toAngle < 0 || transition.toAngle > 7){
                var results = findShortestAngle2(fromActivity, toActivity);
                fromPosition = results[0].position;
                transition.fromAngleRun = results[0].angleIndex;
                toPosition = results[1].position;
                transition.toAngleRun = results[1].angleIndex;
            }else{
                toPosition = toActivity.getAnglePosition(transition.toAngle);
                var result = findShortestAngle(toPosition, fromActivity);
                fromPosition = result.position;
                transition.fromAngleRun = result.angleIndex;
            }
        }else{
            if(transition.toAngle < 0 || transition.toAngle > 7){
                fromPosition = fromActivity.getAnglePosition(transition.fromAngle);
                var result = findShortestAngle(fromPosition, toActivity);
                toPosition = result.position;
                transition.toAngleRun = result.angleIndex;
            }else{
                fromPosition = fromActivity.getAnglePosition(transition.fromAngle),
                toPosition = toActivity.getAnglePosition(transition.toAngle);
            }
        }

        return Object.extend(this.createShapeOptions(), {
            style : {
                pointList : [[fromPosition.x, fromPosition.y], [toPosition.x, toPosition.y]],
                strokeColor : selected ? '#f63': '#888',
                lineWidth : 3,
                text : ''
            }
        });
    },

    // 创建箭头配置项（三角形）
    createArrowOptions: function(graph, selected){
        var transition = this,
            fromPosition = graph.getActivity(transition.from).getAnglePosition(((transition.fromAngle < 0 || transition.fromAngle > 7) ? transition.fromAngleRun : transition.fromAngle)),
            toPosition = graph.getActivity(transition.to).getAnglePosition(((transition.toAngle < 0 || transition.toAngle > 7) ? transition.toAngleRun : transition.toAngle));

        // 箭头长度20，单边角度10度
        // 线段角度（从第四象限开始，顺时针旋转）
        var lineAngle = Math.atan2(fromPosition.x - toPosition.x, fromPosition.y - toPosition.y) / Math.PI * 180;
        var end1 = {
                    x: toPosition.x + Math.sin(2 * Math.PI / 360 * (lineAngle - 10)) * 20,
                    y: toPosition.y + Math.cos(2 * Math.PI / 360 * (lineAngle - 10)) * 20,
                };
        var end2 = {
                    x: toPosition.x + Math.sin(2 * Math.PI / 360 * (lineAngle + 10)) * 20,
                    y: toPosition.y + Math.cos(2 * Math.PI / 360 * (lineAngle + 10)) * 20,
                };

        return Object.extend(this.createShapeOptions(), {
            style : {
                pointList : [[toPosition.x, toPosition.y], [end1.x, end1.y], [end2.x, end2.y]],
                color : selected ? '#f63': '#555',
                lineWidth : 0,
                text : ''
            }
        });
    },

    createCircleOptions: function(graph, selected){
        var transition = this,
            fromPosition = graph.getActivity(transition.from).getAnglePosition(((transition.fromAngle < 0 || transition.fromAngle > 7) ? transition.fromAngleRun : transition.fromAngle));
        return Object.extend(this.createShapeOptions(), {
            style:{
                color : selected ? '#f63': '#555',
                lineWidth : 0,
                x: fromPosition.x,
                y: fromPosition.y,
                r: 4
            }
        });
    },

    addTo: function(graph){
        var transition = this;

        // 线段
        var polylineOptions = transition.createPolylineOptions(graph);
        var polyline = new graph.type.Shape.Polyline(polylineOptions);
        graph.addShape(polyline);
        transition.polyline = polyline;

        // 箭头
        var arrowOptions = transition.createArrowOptions(graph);
        var arrow = new graph.type.Shape.Polygon(arrowOptions);
        graph.addShape(arrow);
        transition.arrow = arrow;

        // 起始圆点
        var circleOptions = transition.createCircleOptions(graph);
        var circle = new graph.type.Shape.Circle(circleOptions);
        graph.addShape(circle);
        transition.circle = circle;
    },

    refresh: function(graph){
        var transition = this;

        var polylineOptions = transition.createPolylineOptions(graph, transition.selected);
        var polyline = transition.polyline;
        polyline.style = polylineOptions.style;

        //
        var arrowOptions = transition.createArrowOptions(graph, transition.selected);
        var arrow = transition.arrow;
        arrow.style = arrowOptions.style;

        //
        var circleOptions = transition.createCircleOptions(graph, transition.selected);
        var circle = transition.circle;
        circle.style = circleOptions.style;

        return [polyline, arrow, circle];
    }
});
