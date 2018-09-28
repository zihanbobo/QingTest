function showParentCatelog(catelogUrl, cateDivId, selectValueId){
    var othData ={
        cateDivId :cateDivId,
        selectValueId :selectValueId
    };
    commonAjaxRequest(catelogUrl, null, handleCateLogParam, false, "获取分类信息失败:", "", othData);

}

function handleCateLogParam(resu, othData){
    var cateTreeData = generateCateLogParam(resu.resultList);

    $('#' + othData.cateDivId).ace_tree({
        dataSource: new DataSourceTree({data: cateTreeData}),
        multiSelect:false,
        loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
        'open-icon' : 'icon-minus',
        'close-icon' : 'icon-plus',
        'selectable' : true,
        'selected-icon' : 'icon-ok',
        'unselected-icon' : 'icon-remove'
    });

    $('#' + othData.cateDivId).on('updated', function(e, result) {

        //console.log(result.info[0].id);
        //result.info  >> an array containing selected items
        //result.item
        //result.eventType >> (selected or unselected)
    }).on('selected', function(e,result) {
        $("#" + othData.selectValueId).val(result.info[0].cate_id);
    }).on('unselected', function(e) {
        //取消选择的方法
    }).on('opened', function(e, result) {
        //打开文件夹的方法
    }).on('closed', function(e) {
        //关闭文件夹的方法
    });
}

function generateCateLogParam(resultList){
    var catelogList;
    for(var idx in resultList){
        var catelogBean = resultList[idx];

        var catelog = catelogBean.catelog;
        if(catelog.refType == "cate") {
            if(catelogList == null){
                catelogList= new Object();
            }
            var cateItemObj = new Object();
            cateItemObj.name = catelog.catelogName;
            cateItemObj.type = "item";
            cateItemObj.cate_id = catelog.id;
            catelogList[catelog.catelogName] = cateItemObj;

            var subCateObj = generateCateLogParam(catelogBean.subCategoryList);
            if(subCateObj != null){
                var cateObj = new Object();
                cateObj.name = catelog.catelogName;
                cateObj.type = "folder";
                cateObj.cate_id = catelog.id;
                var addiObj = new Object();
                cateObj.additionalParameters = addiObj;
                addiObj.children = subCateObj;

                catelogList[catelog.catelogName + "-1"] =cateObj;
            }
        }
    }

    return catelogList;
}