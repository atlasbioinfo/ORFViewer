//These parameters need to be self-defined
let geneLength=3075;
let orfInfo=[
    {"name":"ORF1","label":0,"beg":1,"end":3075},
    {"name":"ORF2","label":1,"beg":167,"end":313},
    {"name":"ORF3","label":1,"beg":386,"end":523},
    {"name":"ORF4","label":1,"beg":680,"end":772},
    {"name":"ORF5","label":1,"beg":1382,"end":1603},
    {"name":"ORF6","label":1,"beg":1736,"end":1813},
    {"name":"ORF7","label":1,"beg":2579,"end":2656},
    {"name":"ORF8","label":2,"beg":1554,"end":1634},
    {"name":"ORF9","label":2,"beg":2124,"end":2261},
    {"name":"ORF10","label":3,"beg":2770,"end":2973},
    {"name":"ORF11","label":3,"beg":2548,"end":2637},
    {"name":"ORF12","label":3,"beg":2299,"end":2535},
    {"name":"ORF13","label":3,"beg":2128,"end":2220},
    {"name":"ORF14","label":3,"beg":1687,"end":1845},
    {"name":"ORF15","label":3,"beg":874,"end":1188},
    {"name":"ORF16","label":3,"beg":532,"end":681},
    {"name":"ORF17","label":4,"beg":1938,"end":2249},
    {"name":"ORF18","label":4,"beg":1764,"end":1910},
    {"name":"ORF19","label":4,"beg":1404,"end":1562},
    {"name":"ORF20","label":5,"beg":440,"end":529}
]
let ORFviewerChart = echarts.init(document.getElementById('orfViewerDiv'));

//ORFdraw
let labelStr=new Array('+1',"+2","+3","-1","-2","-3");
let data = [];
let categories = ['+1','+2','+3','-1','-2','-3'];
let cColors = ['#d64f44','#fcaf17','#f173ac','#007d65','#009ad6','#999d9c']

for (let i in orfInfo){
    data.push({
        name:orfInfo[i].name,
        value:[
            orfInfo[i].label,
            orfInfo[i].beg,
            orfInfo[i].end
        ],
        itemStyle:{
            normal:{
                color:cColors[orfInfo[i].label]
            }
        }
    });
}

function renderItem(params, api) {
    
    let label=api.value(0);
    let beg=api.coord([api.value(1), label]);
    let end=api.coord([api.value(2), label]);
    let height = api.size([0, 1])[1]*0.4;
    
    let rectShape = echarts.graphic.clipRectByRect({
        x: beg[0],
        y: beg[1] - height / 2,
        width: end[0] - beg[0],
        height: height
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });

    return rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
    };
}


option = {
    tooltip: {
        triggerOn: 'mousemove',
        formatter: function (params) {
            return [params.marker + params.name,
                'Frame: ' + labelStr[params.value[0]] ,
                'Range: ' + params.value[1]+'nt - '+  params.value[2] +'nt',
                'Length: ' + (params.value[2]-params.value[1]+1)+'nt'
                ].join('</br>');
        }
    },
    title: {
        text: 'ORF viewer',
        left: 'center'
    },
    dataZoom: [{
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 300,
        height: 10,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
        },
        labelFormatter: ''
    }, {
        type: 'inside',
        filterMode: 'weakFilter'
    }],
    grid: {
        height:200
    },
    xAxis: {
        min: 1,
        max: geneLength,
        scale: true,
        axisLabel: {
            formatter: function (val) {
                return val + ' nt';
            }
        }
    },
    yAxis: {
        data: categories
    },
    series: [{
        type: 'custom',
        renderItem: renderItem,
        itemStyle: {
            normal: {
                opacity: 0.8
            }
        },
        encode: {
            x: [1, 2],
            y: 0
        },
        data:data
    }]
};

ORFviewerChart.setOption(option,true);

ORFviewerChart.on('click', function (params) {
    console.log(params.data);
});