var analysis = angular.module('analysis', ['gridster']);
analysis.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', '$mdDialog', 'dataFilterFactory', 'dataSelectionFactory', 'viewFactory', function ($scope, appManager, $mdSidenav, $mdDialog, dataFilterFactory, dataSelectionFactory, viewFactory) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;
    var DF = appManager.data.DF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SF = appManager.state.SF;
    $scope.SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    DF.populateAppData();
    //

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
    };

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


    //MENU FUNCTIONS
    $scope.addCanvasElement = function (name, type) {
        $scope.current.canvas.canvasElements.push(new SC.CanvasElement(name, type));
    };


    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    $scope.current = {
        canvas: null,
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };

    $scope.setSelectionLevel = viewFactory.setSelectionLevel;
    $scope.setDataGroup = viewFactory.setDataGroup;
    $scope.setCanvas = viewFactory.setCanvas;

    viewFactory.setCanvas(DSO.canvases[0], $scope.current);
    
    
    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    $scope.filterResults = dataFilterFactory.filterResults;


    // ---- ---- ---- ---- Filter Side Nav Functions ---- ---- ---- ---- //
    $scope.tempCards = [];
    $scope.filterAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.filterAutoChanged = function (value) {
        dataFilterFactory.quickAddFilter(value, $scope.current.dataGroup, $scope.current.selectionIndex, $scope.tempCards);
        $scope.filterAuto.searchText = null;
    };
    

    // ---- ---- ---- ---- Data Side Nav Functions ---- ---- ---- ---- //
    $scope.dataAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.selectionAutoChanged = function (value) {
        dataSelectionFactory.quickAddDataSelection(value, $scope.current.dataGroup, $scope.current.selectionIndex);
        $scope.dataAuto.searchText = null;
    };


    // ---- ---- ---- ---- Canvas Element Side Nav Functions ---- ---- ---- ---- //
    $scope.addSeries = function (GUID, selection) {
        $scope.current.canvasElement.chart.series.push({ GUID: GUID, selection: selection, options: {} });
    };
    $scope.removeSeries = function (seriesArray, series, index) {

        var element = DF.getCanvasElement($scope.current.canvasElement.GUID);
        if (element.chart) {
            var seriesIndex = element.chart.series.map(function (obj) { return obj.name }).indexOf(series.selection);
            if (seriesIndex >= 0) {
                element.chart.series[seriesIndex].remove(true);
            }
            SF.deleteElement(seriesArray, series, index);
        }
        else {
            console.log("No chart property on element object.");
        }
    };


    $scope.tempChart = {options: null};
    $scope.currentChart = null;
    $scope.$watch('current.canvasElement', function (element) {
        if (element && element.type === 'hc-Chart') {
            var element = DF.getCanvasElement(element.GUID);
            if (element.chart) {
                $scope.currentChart = element.chart;
                $scope.tempChart.options = element.chart.userOptions;
            }
        }
        else {
            $scope.tempChart = { options: null };
            $scope.currentChart = null;
        }
    }, true);

    $scope.updateChart = function () {
        try{
            $scope.currentChart.update($scope.tempChart.options);
        }
        catch (e) {
            logger.toast.error("Invalid options object.", e);
        }
    };


    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //
    $scope.build = function () {
        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);
        console.log(JSON.stringify(queryObject));

        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response);
            dataGroupDataObject.result = response.result;
        }).catch(function (error) { console.log(error); });

    };

}]);
analysis.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    var API = appManager.data.API;
    $scope.SF = appManager.state.SF;
    $scope.DSO = appManager.state.DSO;
    $scope.DO = appManager.data.DO;
    $scope.SO = appManager.state.SO;


    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ---- //
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;

    $scope.dashboardComponents.components[0].action("canvas", $scope.DSO);

    // ---- ---- ---- ---- Component List ---- ---- ---- ---- //
    $scope.componentList = componentViewFactory.componentList;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ---- //
    $scope.componentProperties = componentViewFactory.componentProperties;
    

    $scope.showConfigureDataSource = function (ev) {
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/dataSource.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'DataSource'
        }).then(function () { $scope.componentProperties.getSchema(); }, function () { });
    };
    $scope.showConfigureDataSelections = function (ev) {
        if ($scope.componentProperties.editObject.source.alias !== null) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataSelection.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataSelection'
            });
        }
        else {
            logger.toast.warning('Please Select A Data Source First.');
        }
    };
    $scope.showConfigureFilters = function (ev) {
        if ($scope.componentProperties.editObject.selections[0].length > 0) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataFilter.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataFilter'
            });
        }
        else {
            logger.toast.warning('Please Create Data Selections First.');
        }
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }


}]);
analysis.controller('Analysis', ['$scope', 'appManager', '$state', '$interval', '$mdDialog', function ($scope, appManager, $state, $interval, $mdDialog) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;

    $scope.name = DSO.name;
    $scope.user = SO.user;
    $scope.controlPanels = DSO.dashboard.controlPanels;
    $scope.canvases = DSO.canvases; //used in children scopes

    $scope.viewName = $state.params.viewName.charAt(0).toUpperCase() + $state.params.viewName.slice(1);
    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
        if (stateObject && stateObject.viewName) {
            $scope.viewName = stateObject.viewName.charAt(0).toUpperCase() + stateObject.viewName.slice(1);
        }
    };

    $scope.showAnalysis = function () {
        //var modules = DSO.modules.map(function (obj) { return obj.Module });

        //if (modules.indexOf('analysis') > -1) {
            return true;
        //}
        //return false;
    };


    //Show User Info
    $scope.showUserInfo = function (ev) {
        $mdDialog.show({
            templateUrl: 'shared-components/user/user.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'User'
        });
    };

}]);
analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    var SF = appManager.state.SF;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();
    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.selectedLevel = $scope.componentProperties.editObject.selections[0];
    $scope.selectionIndex = 0;

    $scope.newFilter = new SC.DataFilter($scope.filters[0]);

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = null


    // ---- ---- ---- ---- Filter Settings ---- ---- ---- ---- //
    $scope.selectionChange = function () {
        if ($scope.newFilter.dataValue) {
            $scope.newFilter.alias = $scope.newFilter.dataValue.COLUMN_NAME;
        }
    };

    $scope.addOperation = function () {
        $scope.newFilter.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.newFilter.operations.splice(index, 1);
    };

    $scope.createFilter = function () {
        if ($scope.dataFilterForm.$valid) {

            var filter = angular.copy($scope.newFilter);
            filter.GUID = SF.generateGUID();

            $scope.componentProperties.editObject.filters[$scope.selectionIndex].push(filter);
            $scope.clearFilter();
        }
    };

    $scope.clearFilter = function () {
        $scope.newFilter = new SC.DataFilter($scope.filters[0]);

        $scope.dataFilterForm.$setPristine();
        $scope.dataFilterForm.$setUntouched();
    };


    // ---- ---- ---- ---- Selection Level Navigation ---- ---- ---- ---- //
    $scope.changeSelectionLevel = function () {
        $scope.selectionIndex = $scope.componentProperties.editObject.selections.indexOf($scope.selectedLevel);
    }


    // ---- ---- ---- ---- Selection Levels ---- ---- ---- ---- //
    $scope.moveSelectionUp = function (source, target, targetIndex) {
        if (targetIndex > 0) {
            var desitationIndex = targetIndex - 1;
            var oldSelection = source[desitationIndex];
            source[desitationIndex] = target;
            source[targetIndex] = oldSelection;
        }
    };

    $scope.deleteSelection = function (index) {
        $scope.componentProperties.editObject.filters[$scope.selectionIndex].splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataFilterSettings', ['$scope', '$mdDialog', 'filter', 'current', 'appManager', function ($scope, $mdDialog, filter, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;
    var SF = appManager.state.SF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = null

    $scope.orderChange = function () {
        var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.orderValue } };
        var filterDataObject = DF.getFilter(filter.GUID);

        API.schema().save(postObject).$promise.then(function (response) {
            filterDataObject.dataValues.length = 0;
            response.result.forEach(function (obj) {
                filterDataObject.dataValues.push({ value: obj, isChecked: false });
            });
        });
    };

    
    // ---- ---- ---- ---- Filter Settings ---- ---- ---- ---- //
    $scope.addOperation = function () {
        $scope.filter.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.filter.operations.splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
	MfîŒKtÀ6;cSÕV‡ uÇ‚Âèç”@C bCBàyûAÌc»‹aŒnSÛ€Æë%ø.Áf0²A
=Ö2è×]r‹½Ò¿]ë5r±r_
˜ÀŸ¯(²(,*¾9Òñ ëg'eˆiS`ìN®ˆûT2Ö¾„Ê˜ ÓØí“Ã­Çº¤œ6”ÂçåĞ®c}|Uª)¾|…ü%ëLÅ6X‰hŸëà…©e)€@öØˆŸ4 ók$¥úng‘a¹u?1§M¡ï«§ ƒâ°è¸®_µÄŞşèüÂ]¥/t¤ ÚˆJ€¢¯¼™ŸâfâäQ"Øğkä_ï§pö|Ú–]ºU3}Œ<¹Ö{yÜ®¼Ü`z³ÎiÇ\²Ó>¦‰ê2ÀÈx§zÌ¸%"ıÿğ47÷ñ½çªÃîCÏ[ë'îª²™<l«?Õ-ƒó)Ğß´ˆtF…îqH{sÕ0ó¶0!šÚfNyÅ‹z “±à|Ó÷#ó@¨¹I”Ê½ç¬r¹’IùøñvÊ÷õ$¨»VëúFŸuU2ìˆ|ÉªlâıøÃ3İÅ§Ó˜êÂ4‡vSaˆ°Fİ,«P/GÃ™œ Ì®¯G¹r)úv©¿#©Älî0·O®MxØW±¸şIåP¾Í¿`ªÍø„K&,O‰iq`ºK%oáQ}_Â‰å@†Ï«†x÷Å‚ıü¯d}Ô›ÅDË¸à]Åû/Ïš]Ÿ
Ês¤‡9œ³P?ÛğuØşQ%BB_˜•	,ÄñxÉğ‹Ç:±-˜ë6[“štˆÚû¦XEÕ(ñ¸×FÑGğÑÇ”›œ…Éõ.ı7AÕŞÃóI<
—ÅòŞ‹`_§;DÄ0J?­Wxõ®J·P¸«¨£Ş¢­9˜åz.^)V¾$k,ÁHëFd6ÇyÉÊäÒ-újKìÈİQuÄ’Ájq—¢X‚ß
;¼À×¬ˆOÍ‰~˜¨”†›T?=µğÏİ˜Œ\ëÚº¿Ÿ#3dI¡ù¤ÛÎ5wÎ"
C>=ÀÛƒ•LÁid3É|jDçm¡åÛ~D34øÁ¸ÎH?¡¬&K2ÔWT¡Js”BkØ7ıwË(ÑMõ:Rí¶0VGaË_)ËL%ªâ{¯=¨ïUë´"MÊÑ‘u/|qá¿÷q²¼-FÜ<ØW:jçq£iO*ğC+[€Ä³!À.^ÜQÕÌLØ´Ñxb B-†~1ÍLQˆjş¾ 9*$´á}}§Ø€H¾¸×ı¿+C‚.7Q·+å¦ñøø|a8ûOf1Š Øv&9]£_¤İ®M%¢™E·ï›5jÇj¨ª²N®A:NùŠ/Öğ­£È¦}ÒŸ¯V ¸+(c²¿µbPhì×°oWòVøCQæDq—ù-J¨REÄ­2¾ÉF@.[Áo±üô)Ş¤fõ‹tpº8®µã='{Eöx¹ÊÍÕSUv	 Å8ƒ£àTLßLú_.²¹#(w¯B![ğ,J‚óVM¦ Ù/Ç+ªkÛ—aàúû8=—ôiÚVDè{ÑîÎùytÙ	4É‹ÚAÓpíïàõ4\cKğİe3·„Bºx*ÌtDoŞvaSè!mK~UÑkÈDİÇáCšDÑ©/ŒyÊwO æséÚÎkÀrËkËËZâÜ¨%ˆ]Œâ6ƒFCkP	i‚Z7ºï¨±£rpÿ="ö=Š lÊóÑj@hÖ‹óêêÆYå³_G`e¢£Êt£^xä¹Â‰R4áÄC‡fLÕ¥€ğí‚O­”ë0Mh ÓáÎ{lóÕZ8ÓÇ£ÃÌ²@’İımìue4áMp?S¹Âœÿ< ,Ür“À ©'eh¡tpÖ“d¨ÜDôŞ™Åå]\Äg¡Õ²©ÁMähûì_‹Ñî)éß½¡™3]>U›±oPÓr1œóÏÇ¢–¦mösB6IË^nyq†äßøP¾ºVğÓú[gHë+)}®n‘Ck…sÖŸ†ı¬5LŠx:ZÜcÊsî’'ıÚ£²–†s’ˆ©CêIOÿ~€ÚÑ`÷-9Q3–,?S è ïá
ãŒÎ‹§9äÎyB½ëVó#Ÿ9ùPÜÌ³|†-¡ùLRnÀ_ÉOW1»2xH—°ÔyDluäıı‰î½ÊÿÉtéêûáNşIáøjZí&&j4sõ>»µÇïs™eÍä¬“X·kì½XÔ¾ÌªÖÿ<è#²N„¥LOªoPÕaØø!O6)É(„eÌœ9š[l;È¬)=ÎnI·£Bvúé_Îì‹KpÎy©x”f  ˆ©°îZÁbu¨`ì]_ÆQqT'‚îËP€/à`­˜Š0·Ç;<!«Ï¨¢ØÉîÄ¼6–,¼òGæ•=ü“íBëÙÈL®´¡"¼i$=Â±e!ØdQÀ¸[®]H ¢¥Û|}çk…z[¢P¬ÿuëD¡àßú«àx¨´Öùg¬6j&ı¬ı„G&Sv”şß.¼C¸¼vŸ'b\±¶çÒGSè7
$I¤FuL>Ï4ÊOb?u–äm¡g3e2B„Ÿ,*Ù±¦ºäµÇÌúáu<Ö“©û…»¯°%ØIk»ÓCİÿ«\èæQŒ2qö´~%vÛ–óhd¹/$CÑ@G@®0+`ã_ğ‹hü¹›AMkĞ 	Ğ›
{sR‡İ’g-;¼Cw„û YZ†usg4yµÖ˜ÍMÔéoïSñüCæ¦`ü`tsßíá¬Z<‚8$@³–œ¢z#Ü‚ZŠ!Ø(˜ò¨D#š$ƒ¬AI×$Èãû1j|3KW•îÜÙ¥ÛmÖŠƒÚCìÄÃ–!kåÌµ)êe¡İöwíñ]l+©êêeÜ×™ã|’v@3óC9Õ©†º¸ˆæÿR)ÃğfD2şŸÅ¸ãÛ^p¶ıY¢×¾“ƒãóÙ&;ø9?ƒò~ØÜ’š¨|Ã·CØS†£r7lå¨Qpı¡MğCÎy•`k¡Ä(É@Gœ¸}¨0ÉuLƒq©mÉˆ·Ekrw“Ü0~KŸ"lñò¼|‚EŞ\©´€¡úkw÷e
Hg‰“‹õN¶€«Ğ­·òŒé	Šß|1û744‘`}gG0=ÔnÔÑ–9æÀ@ÆHz½4y~m/™ê:T¢Ğ¶çÏÓô>§|›J÷1†7‘-Õ-†Ò0 h‚°×7Ñæé’æ[Ì¹ØtiìE~´ş²_¹=j
r§ú=~ùÓméaQcı,zü§”ŸÑ’:#îÍy#Üâ7ksº«	q¤Tø‚‹·d1È	N@¾úö"sÚDOÇî,Y(åW;Ô¿@ôı)³+%±úNÿaz–Ïé¡FÔ©0ÊVfıH®ãPV\®G<—*¿lY^cÊRE Ğs¤²€A¤}"YEI¡¶•Ñ°ŞQyb¯ùˆ=u«@ªÀ5İ1Ğ€1ƒÃ»Ñ”7ÓÜıùŒqòµ'y×VHÑ®ÿæ2…m†şóï(xÀ¶³œMcØ-8[“{?ˆúíŒşIü—ŞÑŞ¶‹Íß(?™±Ë)X³	¿î‚m}°}|œy 5Lx2ª<f•®«ĞyóOIf}·¡ªNAıYp"Î=$€"ZïÜqEÿA•aQ¤/¯«Æa!NàêÃ°ª»x$Ê"¶Û™ÃÈ ´~ O“à¶¦LXÌøó¬
¸iÁÑ4<’£V7>nÒ 4#Õ_ğœ3Ô3şi¡CëÑ¯ÁrïÉÎQx‡øç<r}0;'®kYúøˆ0íRÖj‰j3Eşßè6LË# ŸÊéÎH6¿xnaWìÉÔt¬Ê\ {hW—Yb£´pÃ[F¦)µÖ( rN“¦í®ie…­• §Õ“HT@L›ËÏ‰Ë³x7dËøıÜî¢ĞĞng^SWy©ä!‚µVÜ8"…F£ıy(‚spÜ ødÕæÍh
¤e<J0r-U£ç@EİhŞ¾Š æ?V'ñµ'ÔĞˆİ@ƒ-ª¶õ™aky¿öÙWûSŠVáËC+—r$+mïÛ4_½äÇ+¡æÍ¡ùû8Kä%FÿIGÒ¿eÄ{œé'Üº=å6Í)SirÀG~IaÔ³x}ÓTe»U?æÏ¥U2âŞù®a ÈuïxuŠBd[»¢°4§B¥F¥ÿw	€È¬[)Ûû0z %ãµhÍÁ£Í:—´}¸¨÷uVB‰ ‘dÎh¡dzúdÅ<å1ç¥"Écşõ¥òV'Œeºö\d:Òêä×¥'<e›òg9±é2õëÓìo)ã¥„ŒMã©`Á3u/²T)uƒb[˜àv]~I^ê¦¯3pâ€(>¢İµÄG[VÎÖoëä°åö~„3|ªÎ€ÓW>ì¿©jšäšçú0×ö,'ğ;(z¡®ÇìÔzmÖèæÒç	Eâ{@˜ÒRîki³™r¹!*5}X¦MŸFä1¡’Ã	?½B$=±£èXÜõâp ¨ ©Ó¤»İ0¤>Í–œ;ŠóÛK#úlok —ïjĞQUÛ¼L„îbùÓoÛ~[;=D©­òCXî,ÙnĞ¬:„Ô°zz¼Ùvwæ†ï§™„Kùä3òüJÇ<-K%ÿo%êDİìÊ€•7uù]¿I–Nà[ë •NÁ7ò)­â¶Êmç*yŸI „Ú­w®n%ü„ÆøÊ``9l(Y­†òbgÜ1IÍ‡¨ÀE×ä«¥Ú|Ğ¢eèu×Õ‡ıs¡¿°œ%YÆğDd'N°«%Ã¶ğ‹¡æy2V	ÇŒåOS™z9ƒ«‡%LY0‹V:Íº„rcûY0_1ŠÂ#'íKª@$nü9§Ô ±—¦Î”ËÛ}Òk/Ä¼ó[e*»Ñİlßv¢
analysis.controller('DataSelectionSettings', ['$scope', '$mdDialog', 'selection', 'current', 'appManager', function ($scope, $mdDialog, selection, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.selection = selection;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;
    var SF = appManager.state.SF;

    $scope.pivotProgress = false;

    $scope.pivotChcked = function () {
        if (selection.pivot) {
            loadPivotValues();
            selection.aggregateFunction = true;
        }
    };
    $scope.aggregateFunctionChecked = function () {
        if (!selection.aggregateFunction) {
            selection.pivot = false;
        }
    };


    function loadPivotValues() {
        if (selection.pivot && selection.dataValue && !$scope.pivotValues) {

            $scope.pivotProgress = true;
            var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: selection.dataValue.COLUMN_NAME, order: 'asc' } };

            API.schema().save(postObject).$promise.then(function (response) {
                $scope.pivotProgress = false;
                $scope.pivotValues = response.result;
            });
        }
    }
    loadPivotValues();

    $scope.pivotOperations = [
        { operation: "equal", name: "Equal", selectedValues: [] },
        { operation: "greater", name: "Greater", selectedValues: [] },
        { operation: "less", name: "Less", selectedValues: [] },
        { operation: "greaterE", name: "Greater or Equal", selectedValues: [] },
        { operation: "lessE", name: "Less or Equal", selectedValues: [] }

    ];
    $scope.pivotOperation = null;
    $scope.addOperation = function () {
        selection.pivotValues.push($scope.pivotOperation);
        $scope.pivotOperation = null;
    }
    $scope.removeOperation = function (index) {
        selection.pivotValues.splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataSource', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    $scope.SO = appManager.state.SO;


    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.dataSets = $scope.SO.product.DataSources.filter(function (obj) {
        return obj.SourceType === 'T';
    });

    $scope.procedures = $scope.SO.product.DataSources.filter(function (obj) {
        return obj.SourceType === 'P';
    })

    $scope.setDataSource = function (dataSourceObject) {
        $scope.componentProperties.editObject.source.alias = dataSourceObject.Alias;
        $scope.componentProperties.editObject.source.type = dataSourceObject.SourceType;
        $scope.closeDialog();
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataView', ['$scope', 'appManager', '$mdSidenav', 'dataFilterFactory', 'dataSelectionFactory', 'viewFactory', function ($scope, appManager, $mdSidenav, dataFilterFactory, dataSelectionFactory, viewFactory) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;
    var DF = appManager.data.DF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SF = appManager.state.SF;
    $scope.SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    DF.populateAppData();
    //

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.dataViewOptions = {
        columns: 1,
        rowHeight: 25,
        minSizeY: 6,
        margins: [1, 10],
        resizable: {
            enabled: true,
            handles: ['s'],
        },
    };
    $scope.item = { sizeX: 1, sizeY: 1 };


    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    $scope.current = {
        canvas: null,
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };

    $scope.setSelectionLevel = viewFactory.setSelectionLevel;
    $scope.setDataGroup = viewFactory.setDataGroup;
    $scope.setCanvas = viewFactory.setCanvas;

    viewFactory.setCanvas(DSO.canvases[0], $scope.current);


    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    $scope.filterResults = dataFilterFactory.filterResults;


    // ---- ---- ---- ---- Filter Side Nav Functions ---- ---- ---- ---- //
    $scope.tempCards = [];
    $scope.filterAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.filterAutoChanged = function (value) {
        dataFilterFactory.quickAddFilter(value, $scope.current.dataGroup, $scope.current.selectionIndex, $scope.tempCards);
        $scope.filterAuto.searchText = null;
    };


    // ---- ---- ---- ---- Data Side Nav Functions ---- ---- ---- ---- //
    $scope.dataAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.selectionAutoChanged = function (value) {
        dataSelectionFactory.quickAddDataSelection(value, $scope.current.dataGroup, $scope.current.selectionIndex);
        $scope.dataAuto.searchText = null;
    };


    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //
    $scope.build = function () {
        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);

        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response.result);
            dataGroupDataObject.result = response.result;
        }).catch(function (error) { console.log(error); });

    };

}]);
analysis.directive('hcChart', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=element'
        },
        link: function (scope, element) {

            var chart;

            // ---- ---- ---- ---- Scope Variable and Setup ---- ---- ---- ---- //
            scope.chartDataObjects = [];

            var uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
            var axis = buildAxis(uniqueGUIDs);

            var defaultchartOptions = {
                chart: {
                    backgroundColor: 'transparent',
                    animation: true
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    labels: {
                        format: '{value:,.0f}'
                    },
                }
            };
            scope.canvasElement.chart.options = (typeof scope.canvasElement.chart.options === 'undefined') ? defaultchartOptions : scope.canvasElement.chart.options;


            // ---- ---- ---- ---- Functions ---- ---- ---- ---- //

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chart.options);

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            // takes the series array and updates the values with new data object results.
            function updateSeries(seriesArray) {

                seriesArray.forEach(function (series, seriesIndex) {
                    
                    var seriesData = createSeriesData(series, false);

                    if (seriesData) {
                        var newLength = seriesData.length;
                        var existingLength = chart.series[seriesIndex].data.length;

                        if (newLength > existingLength) {

                            //inject Axis
                            chart.xAxis[0].setCategories(axis);

                            //Change existing points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex]);
                            });

                            //Add new points
                            for (var i = existingLength; i < newLength; i++) {
                                chart.series[seriesIndex].addPoint(seriesData[i]);
                            }

                        } else if (existingLength > newLength) {
                            var diff = existingLength - newLength;

                            //Remove Points
                            for (var i = existingLength - 1; i > existingLength - 1 - diff; i--) {
                                chart.series[seriesIndex].data[i].remove();
                            }

                            //inject Axis
                            chart.xAxis[0].setCategories(axis);

                            //Update Points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex]);
                            });

                        } else {
                            //inject Axis
                            chart.xAxis[0].setCategories(axis);

                            //Update Points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex]);
                            });
                        }
                    }                    
                });
            };

            // takes the array of element series and adds them or updates them in the chart.
            function populateSeries(seriesArray) {
                scope.chartDataObjects.length = 0;
                seriesArray.forEach(function (series) {

                    var seriesData = createSeriesData(series, true);
                    var existingSeries = chart.series.map(function (obj) { return obj.name; });
                    var index = existingSeries.indexOf(series.selection);

                    if (index >= 0) {
                        chart.series[index].setData(seriesData);
                    }
                    else {
                        chart.addSeries({ name: series.selection, data: seriesData });
                    }

                });
            };

            // takes a single series, populates and formats the data from the data manager.
            function createSeriesData(series, addReferenceBool) {
                var seriesData = [];
                var data = appManager.data.DF.getDataGroup(series.GUID);

                //add data reference to watcher for chart data objects
                if (addReferenceBool) {
                    addDataReference(data);
                }

                if (data && data.result) {
                    var index = data.result[0].indexOf(series.selection);
                    var titleIndex = 0;
                    if (data.result[0][0] === 'RowNum') {
                        titleIndex = 1;
                    }

                    if (index >= 0) {
                        data.result.forEach(function (row, rowIndex) {
                            if (rowIndex > 0) {
                                var point = {
                                    y: row[index],
                                    x: axis.indexOf(row[titleIndex])
                                };
                                console.log(point);
                                seriesData.push(point);
                            }
                        });
                    }
                }
                return seriesData;
            }

            // takes and array of GUIDs, gets values from the data manager and create an array of unique values for the x-axis.
            function buildAxis(GUIDArray) {
                var axisValues = [];
                GUIDArray.forEach(function (GUID) {
                    var data = appManager.data.DF.getDataGroup(GUID);
                    if (data && data.result) {
                        if (data.result[0][0] === 'RowNum') {
                            data.result.forEach(function (row, rowIndex) {
                                if (rowIndex > 0) {
                                    axisValues.push(row[1]);
                                }
                            });
                        }
                        else {
                            data.result.forEach(function (row, rowIndex) {
                                if (rowIndex > 0) {
                                    axisValues.push(row[0]);
                                }
                            });
                        }
                    }
                });
                console.log(unique(axisValues));
                return unique(axisValues);
            };

            // adds data reference to watcher array if it doesn't exist already.
            function addDataReference(data) {
                var existingGUID = scope.chartDataObjects.map(function (obj) { return obj.GUID; });
                var index = existingGUID.indexOf(data.GUID);

                if (index < 0) {
                    scope.chartDataObjects.push(data);
                }
            }

            // takes and array, returns array with only unique values.
            function unique(array) {
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }
                return array.filter(onlyUnique);
            };


            // ---- ---- ---- ---- Watchers ---- ---- ---- ---- //

            // watch size of parent div to resize chart when needed.
            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });

            // deep watch for changes in chart series.
            scope.$watch('canvasElement.chart.series', function (nv, ov) {
                if (nv !== ov) {
                    uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
                    axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } });
                    populateSeries(scope.canvasElement.chart.series);
                }
            }, true);

            scope.$watch('chartDataObjects', function (nv, ov) {
                if (nv !== ov) {
                    uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
                    axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } });
                    updateSeries(scope.canvasElement.chart.series);
                }
                console.log("data changed");
            }, true);

            // ---- ---- ---- ---- Load & Register ---- ---- ---- ---- //

            loadChart();

            // register chart and DOM element in data manager to create expose to other parts of app.
            appManager.data.DO.canvasElements.push({ GUID: scope.canvasElement.GUID, ChartDOM: element, chart: chart });
            console.log(appManager.data.DO);
            console.log("Registered");

        }
    };
}])
analysis.directive('ngJsoneditor', ['$timeout', function ($timeout) {
    var defaults = {};

    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: { 'options': '=', 'ngJsoneditor': '=', 'preferText': '=' },
        link: function ($scope, element, attrs, ngModel) {
            var debounceTo, debounceFrom;
            var editor;
            var internalTrigger = false;

            if (!angular.isDefined(window.JSONEditor)) {
                throw new Error("Please add the jsoneditor.js script first!");
            }

            function _createEditor(options) {
                var settings = angular.extend({}, defaults, options);
                var theOptions = angular.extend({}, settings, {
                    change: function () {
                        if (typeof debounceTo !== 'undefined') {
                            $timeout.cancel(debounceTo);
                        }

                        debounceTo = $timeout(function () {
                            if (editor) {
                                internalTrigger = true;
                                var error = undefined;
                                try {
                                    ngModel.$setViewValue($scope.preferText === true ? editor.getText() : editor.get());
                                } catch (err) {
                                    error = err;
                                }

                                if (settings && settings.hasOwnProperty('change')) {
                                    settings.change(error);
                                }
                            }
                        }, settings.timeout || 100);
                    }
                });

                element.html('');

                var instance = new JSONEditor(element[0], theOptions);

                if ($scope.ngJsoneditor instanceof Function) {
                    $timeout(function () { $scope.ngJsoneditor(instance); });
                }

                return instance;
            }

            $scope.$watch('options', function (newValue, oldValue) {
                for (var k in newValue) {
                    if (newValue.hasOwnProperty(k)) {
                        var v = newValue[k];

                        if (newValue[k] !== oldValue[k]) {
                            if (k === 'mode') {
                                editor.setMode(v);
                            } else if (k === 'name') {
                                editor.setName(v);
                            } else { //other settings cannot be changed without re-creating the JsonEditor
                                editor = _createEditor(newValue);
                                $scope.updateJsonEditor();
                                return;
                            }
                        }
                    }
                }
            }, true);

            $scope.$on('$destroy', function () {
                //remove jsoneditor?
            });

            $scope.updateJsonEditor = function (newValue) {
                if (internalTrigger) {
                    //ignore if called by $setViewValue (after debounceTo)
                    internalTrigger = false;
                    return;
                }

                if (typeof debounceFrom !== 'undefined') {
                    $timeout.cancel(debounceFrom);
                }

                debounceFrom = $timeout(function () {
                    if (($scope.preferText === true) && !angular.isObject(ngModel.$viewValue)) {
                        editor.setText(ngModel.$viewValue || '{}');
                    } else {
                        editor.set(ngModel.$viewValue || {});
                    }
                }, $scope.options.timeout || 100);
            };

            editor = _createEditor($scope.options);

            if ($scope.options.hasOwnProperty('expanded')) {
                $timeout($scope.options.expanded ? function () { editor.expandAll() } : function () { editor.collapseAll() }, ($scope.options.timeout || 100) + 100);
            }

            ngModel.$render = $scope.updateJsonEditor;
            $scope.$watch(function () { return ngModel.$modelValue; }, $scope.updateJsonEditor, true); //if someone changes ng-model from outside
        }
    };
}]);
analysis.factory('componentViewFactory', ['appManager', '$mdDialog', function (appManager, $mdDialog) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SO = appManager.state.SO;
    var factory = {};


    // ---- ---- ---- ---- DASHBOARD COMPONENTS ---- ---- ---- ---- //
    factory.dashboardComponents = {
        selection: null,
        components: [
            { text: 'Canvases', icon: 'assets/icons/md-tab.svg', component: 'canvas', action: selectCanvas },
            { text: 'Data Groups', icon: 'assets/icons/md-storage.svg', component: 'dataGroup', action: selectDataGroup },
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElement', action: selectCanvasElement }
        ],
        actions: [
            { text: 'Add New Canvas', icon: 'assets/icons/md-add-circle.svg', component: 'canvas', action: newComponent },
            { text: 'Open Saved Canvas', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Open Report', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Add New Data Group', icon: 'assets/icons/md-add-circle.svg', component: 'dataGroup', action: newComponent },
            { text: 'Select New Data', icon: 'assets/icons/md-done.svg', component: 'dataSelection', action: newComponent },
            { text: 'Add New Data Filter', icon: 'assets/icons/md-add-circle.svg', component: 'dataFilter', action: newComponent },
            { text: 'Add New Canvas Element', icon: 'assets/icons/md-add-circle.svg', component: 'canvasElement', action: newComponent }
        ]
    };
    function selectCanvas(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [{
            header: productLine.name,
            parent: productLine.canvases,
            children: productLine.canvases
        }];
        factory.componentList.components = list;
    };
    function selectDataGroup(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var listItem = {
                header: 'Canvas: ' + canvas.name,
                parent: canvas.dataGroups,
                children: canvas.dataGroups,
                parentObject: canvas
            };
            list.push(listItem);
        });
        factory.componentList.components = list;
    }
    function selectDataSelection(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var header = 'Canvas: ' + canvas.name;
            canvas.dataGroups.forEach(function (dataGroup) {
                var endHeader = header + ' | Data Group: ' + dataGroup.name;
                var listItem = {
                    header: endHeader,
                    parent: dataGroup.dataSelections,
                    children: dataGroup.dataSelections
                };
                list.push(listItem);
            });

        });
        factory.componentList.components = list;
    }
    function selectDataFilter(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var header = 'Canvas: ' + canvas.name;
            canvas.dataGroups.forEach(function (dataGroup) {
                var endHeader = header + ' | Data Group: ' + dataGroup.name;
                var listItem = {
                    header: endHeader,
                    parent: dataGroup.dataFilters,
                    children: dataGroup.dataFilters
                };
                list.push(listItem);
            });

        });
        factory.componentList.components = list;
    }
    function selectCanvasElement(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var listItem = {
                header: 'Canvas: ' + canvas.name,
                parent: canvas.canvasElements,
                children: canvas.canvasElements
            };
            list.push(listItem);
        });
        factory.componentList.components = list;
    }
    function newComponent(component) {
        newEdit({ editType: 'new', componentType: component, editParent: null, parentObject: null });
    }


    // ---- ---- ---- ---- COMPONENT LIST ---- ---- ---- ---- //
    factory.componentList = {
        components: null,
        actions: [
            { icon: 'assets/icons/md-edit.svg', tooltip: 'Edit', action: editComponent },
            { icon: 'assets/icons/md-copy.svg', tooltip: 'Duplicate', action: duplicateComponent },
            { icon: 'assets/icons/md-delete.svg', tooltip: 'Delete', action: deleteComponent },
        ]
    };
    function editComponent(component, parent, parentObject) {
        newEdit({ editType: 'existing', editObject: component, editParent: parent, parentObject: parentObject });
    }
    function duplicateComponent(component, parent) {
        var newComponent = angular.copy(component);
        if (newComponent.hasOwnProperty('GUID')) {
            newComponent.GUID = SF.generateGUID();
        }
        parent.push(newComponent);
    }
    function deleteComponent(component, parent) {
        var index = parent.indexOf(component);
        parent.splice(index, 1);
        if (component instanceof SC.DataGroup) {
            var GUIDIndex = parent.map(function (obj) { return obj.GUID }).indexOf(component.GUID);
            DO.dataGroups.splice(GUIDIndex, 1);
        }
    }


    // ---- ---- ---- ---- COMPONENET PROPERTIES ---- ---- ---- ---- //
    factory.componentProperties = {
        editType: null,
        editObject: null,
        editParent: null,
        parentObject: null,
        parentTemp: [],
        closeEdit: closeEdit,
        saveEdit: saveEdit,
        getSchema: getSchema
    };
    function newEdit(editConfig) {
        factory.componentProperties.editType = editConfig.editType;
        factory.componentProperties.editParent = editConfig.editParent;
        factory.componentProperties.parentObject = editConfig.parentObject;
        if (editConfig.editType === 'new') {
            var editObject;

            switch (editConfig.componentType) {
                case 'canvas':
                    editObject = new SC.Canvas('New Canvas');
                    break;
                case 'dataGroup':
                    editObject = new SC.DataGroup('New Data Group');
                    break;
                case 'canvasElement':
                    editObject = new SC.CanvasElement('New Canvas Element');
                    break;
            }
            factory.componentProperties.editObject = editObject;
        }
        else {
            factory.componentProperties.editObject = angular.copy(editConfig.editObject);

            if (factory.componentProperties.editObject.source) {
                getSchema();
            }

        }

    }
    function saveEdit() {
        if (factory.componentProperties.editParent === null) {
            if (factory.componentList.components.length === 1) {
                factory.componentProperties.editParent = factory.componentList.components[0].parent;
                factory.componentProperties.saveEdit();
            }
            else { validateParentDialog(); }
        }
        else {
            if (factory.componentProperties.editType === 'new') {
                factory.componentProperties.editParent.push(factory.componentProperties.editObject);
                //push new DO.dataGroup registry
                if (factory.componentProperties.editObject instanceof SC.DataGroup) {

                    // var newDataObject = { GUID: factory.componentProperties.editObject.GUID, result: null, drillDown: [] }
                    // DO.dataGroups.push(newDataObject);

                    //GET DISTINCT FOR SELECTION LEVELS
                    //factory.componentProperties.editObject.drillDown.level.forEach(function (level, levelIndex) {
                    //    //newDataObject.drillDown[levelIndex] =  getColumnDistinct(factory.componentProperties.editObject.source.product, factory.componentProperties.editObject.source.alias, level);
                    //    //THIS is actually not the right place for this functionality
                    //    //When the user selections a region, the next chip autocomplete needs to only show
                    //    //options availalbe in that region, or in otherwords, WHERE Region = .. etc.
                    //});
                }
            }
            else if (factory.componentProperties.editType === 'existing') {
                var index = factory.componentProperties.editParent.map(function (obj) { return obj.GUID }).indexOf(factory.componentProperties.editObject.GUID);
                factory.componentProperties.editParent[index] = factory.componentProperties.editObject;
            }
            closeEdit();
        }
        DF.populateAppData();
    }
    function closeEdit() {
        factory.componentProperties.editObject = null;
        factory.componentProperties.editType = null;
    }
    function validateParentDialog() {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'core-components/analysis/templates/validateParent.dialog.html',
            controller: 'DataSelection'
        });
    };
    function getSchema() {
        if (factory.componentProperties.editObject.source.type === 'T') {
            //REMOVE BEFORE FLIGHT
            API.schema().save(logger.postObject({ type: "table", alias: factory.componentProperties.editObject.source.alias })).$promise.then(function (response) {
                //API.tableSchema().get().$promise.then(function (response) {
                DO.tableSchema = response.result;
            }).catch(function (error) {
                logger.toast.error('Error Getting Table Schema', error);
            });
        }
    }


    return factory;
}]);
analysis.factory('dataFilterFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    factory.filterResults = function (query) {
        if (query) {
            var results = DO.tableSchema.filter(function (tableValue) {
                return angular.lowercase(tableValue.COLUMN_NAME).indexOf(angular.lowercase(query)) >= 0;
            });
            return results ? results : [];
        }
        else { return DO.tableSchema; }
    };

    factory.quickAddFilter = function(dataValue, dataGroup, selectionIndex, tempCards) {
        if (dataValue) {

            var newFilter = new SC.DataFilter(SF.availableDataFilters()[0], dataValue);
            newFilter.alias = dataValue.COLUMN_NAME;
            newFilter.operations.push({ operation: "in", name: "Range", type: 'dfo-checklist', selectedValues: [] });

            var newFilterDataObject = { GUID: newFilter.GUID, dataValues: [] };

            var tempGUID = SF.generateGUID();
            createTempCard(dataValue, tempGUID, tempCards);

            var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: newFilter.dataValue.COLUMN_NAME, order: newFilter.dataValueOrder } };

            API.schema().save(postObject).$promise.then(function (response) {
                response.result.forEach(function (obj) {
                    newFilterDataObject.dataValues.push({ value: obj, isChecked: false });
                });
                DO.filters.push(newFilterDataObject);
                deleteTempCard(tempGUID, tempCards);
                dataGroup.filters[selectionIndex].push(newFilter);
            });
        }
    };

    function createTempCard(dataValue, GUID, tempCards) {
        tempCards.push({ alias: dataValue.COLUMN_NAME, GUID: GUID });
    }
    function deleteTempCard(GUID, tempCards) {
        var index = tempCards.map(function (obj) { return obj.GUID }).indexOf(GUID);
        if (index >= 0) {
            tempCards.splice(index, 1);
        }
    }

    return factory;
}]);
analysis.factory('dataSelectionFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //

    factory.quickAddDataSelection = function(dataValue, dataGroup, selectionIndex) {
        if (dataValue) {

            var newSelection = new SC.DataSelection({ name: "Custom Data Selection", type: "custom-data-selection" }, dataValue);
            newSelection.alias = dataValue.COLUMN_NAME;

            dataGroup.selections[selectionIndex].push(newSelection);
        }
    };


    return factory;
}]);
analysis.factory('viewFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var factory = {};

    // ---- ---- ---- ---- Query Functions ---- ---- ---- ---- //
    factory.buildQueryObject = function(dataGroup, selectionIndex) {
        return {
            source: dataGroup.source,
            pagination: dataGroup.pagination,
            aggregation: dataGroup.aggregation,
            selections: dataGroup.selections[selectionIndex],
            filters: dataGroup.filters[selectionIndex]
        }
    };

    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    factory.setSelectionLevel = function(selectionLevel, index, current) {
        current.selectionLevel = selectionLevel;
        current.selectionIndex = index;
    }

    factory.setDataGroup = function (dataGroup, current) {
        console.log(dataGroup);
        console.log(current);

        current.dataGroup = dataGroup;
        factory.setSelectionLevel(dataGroup.selections[0], 0, current);

        if (dataGroup.source.type === 'T') {
            //REMOVE BEFORE FLIGHT
            API.schema().save(logger.postObject({ type: "table", alias: dataGroup.source.alias })).$promise.then(function (response) {
                //API.tableSchema().get().$promise.then(function (response) {
                DO.tableSchema = response.result;
            }).catch(function (error) {
                logger.toast.error('Error Getting Table Schema', error);
            });
        }
    };

    factory.setCanvas = function (canvas, current) {
        current.canvas = canvas;
        factory.setDataGroup(canvas.dataGroups[0], current);
    };

    return factory;
}]);