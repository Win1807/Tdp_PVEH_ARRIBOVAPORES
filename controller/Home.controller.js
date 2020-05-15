jQuery.sap.require("sap.ui.veh_arribovapores.util.Formatter");
jQuery.sap.require("sap/ui/model/json/JSONModel");
jQuery.sap.require("sap/m/MessageToast");
jQuery.sap.require("sap/m/Table");
// jQuery.sap.require("sap/m/semantic");

sap.ui.define([
	"sap/ui/veh_arribovapores/controller/BaseController",
	"sap/ui/veh_arribovapores/util/Formatter",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter"
], function (BaseController, formatter, MessageBox, JSONModel, FilterOperator, Filter, Sorter) {
    "use strict";
	var click=1;
    return BaseController.extend("sap.ui.veh_arribovapores.controller.Home", {
		formatter: formatter,
		onInit : function () {
			var myModel = this.getOwnerComponent().getModel();
			myModel.setSizeLimit(99999);
    	},
    	
    	onSearch:function(){
//			var aFilter = [];
//			var Marca = this.getView().byId("Marca").getSelectedKey();
//			var DateInicio = this.getView().byId("dateInicio").getValue();
//			var DateFin = this.getView().byId("dateFin").getValue();
//			var FormattedDate1 = new Date(DateInicio +" 00:00");
//			var FormattedDate2 = new Date(DateFin +" 00:00");
//			if (Marca != "") {
//				aFilter.push(
//					new Filter("Marca", FilterOperator.EQ, Marca)
//				);
//			}
//			if(DateInicio != "" && DateFin != ""){
//				aFilter.push(
//					new Filter("Flleg", FilterOperator.BT,FormattedDate1,FormattedDate2)
//				);
//			}
//			var oList = this.getView().byId("STArriboVapores").getTable();
//			var oBinding = oList.getBinding("items");
//			oBinding.filter(aFilter);
            
              this.getView().byId("STArriboVapores").rebindTable();
		},
		
		range: function(oInit, oEnd, oData){
		   $.each(oData, function(key, item){
		       var sId = item.sId;
		       if(key >= oInit && key <= oEnd){
		           sap.ui.getCore().byId(sId).setVisible(true);
		       }else{                    
		           sap.ui.getCore().byId(sId).setVisible(false);
		       }
		   });
		},
		
		goTo: function(oClick){
		   var oSelectItem = this.getView().byId("sShow").getSelectedKey();
		   var oTable =  this.getView().byId("STArriboVapores").getTable().getItems();
		   var oTotal = oTable.length;
		   var oShow = Math.ceil(oTotal / oSelectItem);            
		   if(oClick <= oShow){
		       if(oShow == oClick){
		          this.getView().byId("btnSiguiente").setEnabled(false);
		       }else{
		          this.getView().byId("btnSiguiente").setEnabled(true);
		       }
		       var range = this.range(oSelectItem * (oClick - 1), (oSelectItem * oClick) - 1, oTable);
		   }
		},
		
		goNext: function(){
			this.goTo(click += 1);
			if(click != 0){
			    this.getView().byId("btnAnterior").setEnabled(true);
			}else{
			    this.getView().byId("btnAnterior").setEnabled(false);
			}
		},
		
		goPrevious: function(){
		    this.goTo(click -= 1);
		    if(click <= 1){
		        this.getView().byId("btnAnterior").setEnabled(false);
		    }else{
		        this.getView().byId("btnAnterior").setEnabled(true);
		    }
		},
		//Evento que se activa cuando cambian la cantidad de items a mostrar
        onShow: function(oEvent){
        	click = 1;
        	this.goTo(click);
        },
        
        //Evento dataReceived del Smart Table
		onLoad: function(oEvent){   //Evento se activa cuando trae data el smart table
			var tblcant = this.getView().byId("STArriboVapores").getTable().getItems().length;
			if(tblcant == 0){
				this.getView().byId("btnSiguiente").setEnabled(false);
				this.getView().byId("btnAnterior").setEnabled(false);
			}else{
				this.getView().byId("btnSiguiente").setEnabled(true);
				this.getView().byId("btnAnterior").setEnabled(true);
			}
			this.goTo(click);
			if(click == 1){
				this.getView().byId("btnAnterior").setEnabled(false);
			}else{
				this.getView().byId("btnAnterior").setEnabled(true);  
			}
        },

		onNavBack: function(){
			window.history.back();
		},
        onBeforeTBL: function(oEvent){
           var aFilter = oEvent.mParameters.bindingParams.filters;
           
			var Marca = this.getView().byId("Marca").getSelectedKey();
			var DateInicio = this.getView().byId("dateInicio").getValue();
			var DateFin = this.getView().byId("dateFin").getValue();
			var FormattedDate1 = new Date(DateInicio +" 00:00");
			var FormattedDate2 = new Date(DateFin +" 00:00");
			if (Marca != "") {
				aFilter.push(
					new Filter("Marca",FilterOperator.StartsWith, Marca)
				);
			}
			if(DateInicio != "" && DateFin != ""){
				aFilter.push(
					new Filter("Flleg", FilterOperator.BT,FormattedDate1,FormattedDate2)
				);
            }else if(DateInicio != ""){
            aFilter.push(
					new Filter("Flleg", FilterOperator.EQ,FormattedDate1)
				);
			}
//			var oList = this.getView().byId("STArriboVapores").getTable();
//			var oBinding = oList.getBinding("items");
//			oBinding.filter(aFilter);  
            
            oEvent.mParameters.bindingParams.filters = aFilter;
        },
        onBeforeExport: function(oEvt) {
            var mExcelSettings = oEvt.getParameter("exportSettings");
            // GW export
            if (mExcelSettings.url) {
                return;
            }
            // For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

            // Disable Worker as Mockserver is used in explored --> Do not use this for real applications!
            mExcelSettings.worker = false;
            
            //Modificar formato de las columnas
            mExcelSettings.workbook.columns[1].type = "Date";
        }
        
    });
});