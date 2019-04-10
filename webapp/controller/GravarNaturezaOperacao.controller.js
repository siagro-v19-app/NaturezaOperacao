sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"br/com/idxtecNaturezaOperacao/helpers/CfopHelpDialog",
	"br/com/idxtecNaturezaOperacao/helpers/CstCofinsHelpDialog",
	"br/com/idxtecNaturezaOperacao/helpers/CstPisHelpDialog",
	"br/com/idxtecNaturezaOperacao/helpers/CstIcmsHelpDialog",
	"br/com/idxtecNaturezaOperacao/helpers/CstIpiHelpDialog",
	"br/com/idxtecNaturezaOperacao/services/Session"
], function(Controller, JSONModel, MessageBox, History, CfopHelpDialog, CstCofinsHelpDialog, CstPisHelpDialog,
	CstIcmsHelpDialog, CstIpiHelpDialog, Session) {
	"use strict";

	return Controller.extend("br.com.idxtecNaturezaOperacao.controller.GravarNaturezaOperacao", {
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("gravarnatureza").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel,"model");
		},
		
		cfopReceived: function() {
			this.getView().byId("cfop").setSelectedKey(this.getModel("model").getProperty("/Cfop"));
		},
		
		cstCofinsReceived: function() {
			this.getView().byId("cstcofins").setSelectedKey(this.getModel("model").getProperty("/CstCofins"));
		},
		
		cstPisReceived: function() {
			this.getView().byId("cstpis").setSelectedKey(this.getModel("model").getProperty("/CstPis"));
		},
		
		cstIcmsReceived: function() {
			this.getView().byId("csticms").setSelectedKey(this.getModel("model").getProperty("/CstIcms"));
		},
		
		cstIpiReceived: function() {
			this.getView().byId("cstipi").setSelectedKey(this.getModel("model").getProperty("/CstIpi"));
		},
		
		handleSearchCfop: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CfopHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchCstCofins: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CstCofinsHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchCstPis: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CstPisHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchCstIcms: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CstIcmsHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchCstIpi: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			CstIpiHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		_routerMatch: function(){
			var oParam = this.getOwnerComponent().getModel("parametros").getData();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			this.getView().byId("cfop").setValue(null);
			this.getView().byId("cstcofins").setValue(null);
			this.getView().byId("csticms").setValue(null);
			this.getView().byId("cstipi").setValue(null);
			this.getView().byId("cstpis").setValue(null);
			
			if (this._operacao === "incluir"){
				
				oViewModel.setData({
					titulo: "Inserir Natureza de Operação",
					codigoEdit: true
				});
			
				var oNovaNatureza = {
					"Codigo": "",
					"Descricao": "",
					"TextoNotaFiscal": "",
					"Cfop": "",
					"CstCofins": "",
					"AliquotaCofins": 0.00,
					"CstPis": "",
					"AliquotaPis": 0.00,
					"CstIcms": "",
					"AliquotaIcms": 0.00,
					"PercentualDiferimentoIcms": 0.00,
					"PercentualReducaoBC": 0.00,
					"CstIpi": "",
					"AliquotaIpi": 0.00,
					"GeraDuplicata": false,
					"MovimentaEstoque": false,
					"Empresa" : Session.get("EMPRESA_ID"),
					"Usuario": Session.get("USUARIO_ID"),
					"EmpresaDetails": { __metadata: { uri: "/Empresas(" + Session.get("EMPRESA_ID") + ")"}},
					"UsuarioDetails": { __metadata: { uri: "/Usuarios(" + Session.get("USUARIO_ID") + ")"}}
				};
				
				oJSONModel.setData(oNovaNatureza);
				
			} else if (this._operacao === "editar"){
				
				oViewModel.setData({
					titulo: "Editar Natureza de Operação",
					codigoEdit: false
				});
				
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					}
				});
			}
		},
		
		onSalvar: function(){
			if (this._checarCampos(this.getView())) {
				MessageBox.warning("Preencha todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createNatOperacao();
			} else if (this._operacao === "editar") {
				this._updateNatOperacao();
			}
		},
		
		_goBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
					window.history.go(-1);
			} else {
				oRouter.navTo("naturezaop", {}, true);
			}
		},
		
		_getDados: function() {
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oDados = oJSONModel.getData();
			
			oDados.CfopDetails = { __metadata: { uri: "/Cfops('" + oDados.Cfop + "')" } };
			oDados.CstCofinsDetails = { __metadata: { uri: "/CstCofinss('" + oDados.CstCofins + "')" } };
			oDados.CstIcmsDetails = { __metadata: { uri: "/CstIcmss('" + oDados.CstIcms + "')" } };
			oDados.CstIpiDetails = { __metadata: { uri: "/CstIpis('" + oDados.CstIpi + "')" } };
			oDados.CstPisDetails = { __metadata: { uri: "/CstPiss('" + oDados.CstPis + "')" } };
			
			return oDados;
		},
		
		_createNatOperacao: function() {
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			
			oModel.create("/NaturezaOperacaos", this._getDados(), {
				success: function() {
					MessageBox.success("Natureza de operação inserida com sucesso!", {
						onClose: function(){
							that._goBack(); 
						}
					});
				}
			});
		},
		
		_updateNatOperacao: function() {
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
		
			oModel.update(this._sPath, this._getDados(), {
					success: function() {
					MessageBox.success("Natureza de operação alterada com sucesso!", {
						onClose: function(){
							that._goBack();
						}
					});
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""
			|| oView.byId("notafiscal").getValue() === "" || oView.byId("cfop").getValue() === ""
			|| oView.byId("cstcofins").getSelectedItem() === null || oView.byId("cstpis").getSelectedItem() === null
			|| oView.byId("csticms").getSelectedItem() === null || oView.byId("cstipi").getSelectedItem() === null){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack();
		},
		
		getModel : function(sModel) {
			return this.getOwnerComponent().getModel(sModel);	
		}
	});
});