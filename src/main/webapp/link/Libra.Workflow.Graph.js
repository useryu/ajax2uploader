var Libra = {};
Libra.Workflow = {};

Libra.Workflow.Graph = function(type, options){
    var graph = this,
        activities = {},
        transitions = {};
    var zrenderInstance,
        contextMenuContainer;

    this.type = type;

    this.addActivity = function(activity){
        activity.graph = graph;
        activities[activity.id] = {object:activity};
    };

    this.getActivity = function(id){ return activities[id].object; };

    this.addTransition = function(transition){
        transition.graph = graph;
        transitions[transition.id] = {object:transition};
    };

    function modElements(shapes){
        shapes.each(function(shape){ zrenderInstance.modElement(shape); });
        return shapes;
    }

    // 当前正在拖放的节点
    var dragingActivity = null;
    // 活动节点拖放开始
    this.onActivityDragStart = function(activity){ dragingActivity = activity; };
    // 活动节点拖放结束
    this.onActivityDragEnd = function(){
        if(dragingActivity) refreshActivityTransitions(dragingActivity);
        dragingActivity = null;
    };
    // 拖动过程处理
    function zrenderInstanceOnMouseMove(){
        if(dragingActivity != null) refreshActivityTransitions(dragingActivity);
    }
    // 刷新活动相关的所有连接弧
    function refreshActivityTransitions(activity){
        var activityId = activity.id;
        for(var key in transitions){
            var transition = transitions[key].object;
            if(transition.from === activityId || transition.to == activityId){
                zrenderInstance.refreshShapes(modElements(transition.refresh(graph)));
            }
        }
    }

    // 当前选中的部件
    var selectedUnit = null;
    this.onUnitSelect = function(unit){
        if(selectedUnit) zrenderInstance.refreshShapes(modElements(selectedUnit.unselect(graph)));
        zrenderInstance.refreshShapes(modElements(unit.select(graph)));
        selectedUnit = unit;
    };

    // 记录当前鼠标在哪个部件上，可以用来生成上下文相关菜单
    var currentUnit = null;
    this.onUnitMouseOver = function(unit){
        currentUnit = unit;
    };
    this.onUnitMouseOut = function(unit){
        if(currentUnit === unit) currentUnit = null;
    };
    // 上下文菜单事件响应
    function onContextMenu(event){
        Event.stop(event);
        if(currentUnit) currentUnit.showContextMenu(event, contextMenuContainer, graph);
    }

    this.addShape = function(shape){
        zrenderInstance.addShape(shape);
    };

    // 初始化
    this.init = function(){
        var canvasElement = options.canvas.element;
        canvasElement.empty();
        canvasElement.setStyle({height: document.viewport.getHeight() + 'px'});
        zrenderInstance = graph.type.zrender.init(document.getElementById(canvasElement.identify()));
        for(var key in activities){ activities[key].object.addTo(graph); }
        for(var key in transitions){ transitions[key].object.addTo(graph); }

        // 创建上下文菜单容器
        contextMenuContainer = new Element('div', {'class': 'context-menu'});
        contextMenuContainer.hide();
        document.body.appendChild(contextMenuContainer);
        Event.observe(contextMenuContainer, 'mouseout', function(event){
                // 关闭时，应判断鼠标是否已经移出菜单容器
                if(!Position.within(contextMenuContainer, event.clientX, event.clientY)){
                    contextMenuContainer.hide();
                }
            });

        // 侦听拖动过程
        zrenderInstance.on('mousemove', zrenderInstanceOnMouseMove);
        // 上下文菜单
        Event.observe(document, 'contextmenu', onContextMenu);
    };

    // 呈现或刷新呈现
    this.render = function(){
        var canvasElement = options.canvas.element;
        canvasElement.setStyle({height: document.viewport.getHeight() + 'px'});
        zrenderInstance.render();
    };
};

/*
 * 部件（包括活动和连接弧）
 */
Libra.Workflow.Unit = Class.create({
    id: null,
    title: null,
    graph: null,
    // 当前是否被选中
    selected: false,
    // 上下文菜单项集合
    contextMenuItems: [],

    initialize: function(options){
        var _this = this;
        _this.id = options.id;
        _this.title = options.title;
    },

    createShapeOptions: function(){
        var _this = this;
        return {
            hoverable : true,
            clickable : true,

            onclick: function(params){
                // 选中并高亮
                _this.graph.onUnitSelect(_this);
            },

            onmouseover: function(params){ _this.graph.onUnitMouseOver(_this); },
            onmouseout: function(params){ _this.graph.onUnitMouseOut(_this); }
        };
    },

    addTo: function(graph){},

    // 刷新显示
    refresh: function(graph){ return []; },

    // 选中
    select: function(graph){
        this.selected = true;
        return this.refresh(graph);
    },
    // 取消选中
    unselect: function(graph){
        this.selected = false;
        return this.refresh(graph);
    },

    // 显示上下文菜单
    showContextMenu: function(event, container, graph){
        container.hide();
        container.innerHTML = '';

        var ul = new Element('ul');
        container.appendChild(ul);
        this.buildContextMenuItems(ul, graph);

        // 加偏移，让鼠标位于菜单内
        var offset = -5;
        var rightEdge = document.body.clientWidth - event.clientX;
		var bottomEdge = document.body.clientHeight - event.clientY;
		if (rightEdge < container.offsetWidth)
			container.style.left = document.body.scrollLeft + event.clientX - container.offsetWidth + offset;
		else
			container.style.left = document.body.scrollLeft + event.clientX + offset;

		if (bottomEdge < container.offsetHeight)
			container.style.top = document.body.scrollTop + event.clientY - container.offsetHeight + offset;
		else
			container.style.top = document.body.scrollTop + event.clientY + offset;

        container.show();
    },

    // 创建上下文菜单项
    buildContextMenuItems: function(container, graph){
        var unit = this;
        unit.contextMenuItems.each(function(item){
                item.addTo(container);
            });
    }
});

/*
 * 上下文菜单项基类
 */
Libra.Workflow.ContextMenuItem = Class.create({
    options: null,
    // 菜单文本
    text: null,

    initialize: function(options){
        this.options = options;
        this.text = options.text;
    },

    //
    addTo: function(container){
        var _this = this;
        var li = new Element('li');
        container.appendChild(li);

        var a = new Element('a', {href:'javascript:;'});
        li.appendChild(a);
        a.insert(_this.text);
        Event.observe(a, 'click', function(){
                _this.onClick();
            });
    },

    onClick: function(){}
});

/*
 * 上下文菜单项（直接执行）
 */
Libra.Workflow.ContextMenuExecuteItem = Class.create(Libra.Workflow.ContextMenuItem, {
    url: null,

    initialize: function($super, options){
        $super(options);
        this.url = options.url;
    },

    onClick: function(){
        alert(this.url);
    }
});