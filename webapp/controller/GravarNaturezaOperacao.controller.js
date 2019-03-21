sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"idxtec/lib/fragment/CfopHelpDialog",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(Controller, JSONModel, CfopHelpDialog, MessageBox, History) {
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
		
		handleSearchCfop: function(oEvent){
			var oHelp = new CfopHelpDialog(this.getView(), "cfop");
			oHelp.getDialog().open();
		},
		
		_routerMatch: function(){
			var oParam = this.getOwnerComponent().getModel("parametros").getData();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
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
					"AliquotaCofins": "",
					"CstPis": "",
					"AliquotaPis": "",
					"CstIcms": "",
					"AliquotaIcms": "",
					"PercentualDiferimentoIcms": "",
					"PercentualReducaoBC": "",
					"CstIpi": "",
					"AliquotaIpi": "",
					"GeraDuplicata": false,
					"MovimentaEstoque": false
				};
				
				oJSONModel.setData(oNovaNatureza);
				
				this.getView().byId("cfop").setSelectedKey("");
				this.getView().byId("cstcofins").setSelectedKey("");
				this.getView().byId("csticms").setSelectedKey("");
				this.getView().byId("cstipi").setSelectedKey("");
				this.getView().byId("cstpis").setSelectedKey("");
				
			} else if (this._operacao === "editar"){
				
				oViewModel.setData({
					titulo: "Editar Natureza de Operação",
					codigoEdit: false
				});
				
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					},
					error: function(oError) {
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onSalvar: function(){
			if (this._checarCampos(this.getView())) {
				MessageBox.information("Preencha todos os campos obrigatórios!");
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
		
		_createNatOperacao: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var that = this;
			
			var oDados = oJSONModel.getData();
			
			oDados.AliquotaCofins = parseFloat(oDados.AliquotaCofins, 0);
			oDados.AliquotaIcms = parseFloat(oDados.AliquotaIcms, 0);
			oDados.AliquotaIpi = parseFloat(oDados.AliquotaIpi, 0);
			oDados.AliquotaPis = parseFloat(oDados.AliquotaPis, 0);
			oDados.PercentualDiferimentoIcms = parseFloat(oDados.PercentualDiferimentoIcms, 0);
			oDados.PercentualReducaoBC = parseFloat(oDados.PercentualReducaoBC, 0);
			
			oDados.CfopDetails = {
				__metadata: {
					uri: "/Cfops('" + oDados.Cfop + "')"
				}
			};
			
			oDados.CstConfinsDetails = {
				__metadata: {
					uri: "/CstCofinss('" + oDados.CstCofins + "')"
				}
			};
			
			oDados.CstIcmsDetails = {
				__metadata: {
					uri: "/CstIcmss('" + oDados.CstIcms + "')"
				}
			};
			
			oDados.CstIpiDetails = {
				__metadata: {
					uri: "/CstIpis('" + oDados.CstIpi + "')"
				}
			};
			
			oDados.CstPisDetails = {
				__metadata: {
					uri: "/CstPiss('" + oDados.CstPis + "')"
				}
			};
			debugger;
			oModel.create("/NaturezaOperacaos", oDados, {
				success: function() {
					MessageBox.success("Natureza de operação inserida com sucesso!", {
						onClose: function(){
							that._goBack(); 
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_updateNatOperacao: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var that = this;
			
			var oDados = oJSONModel.getData();
			
			oDados.AliquotaCofins = parseFloat(oDados.AliquotaCofins, 0);
			oDados.AliquotaIcms = parseFloat(oDados.AliquotaIcms, 0);
			oDados.AliquotaIpi = parseFloat(oDados.AliquotaIpi, 0);
			oDados.AliquotaPis = parseFloat(oDados.AliquotaPis, 0);
			oDados.PercentualDiferimentoIcms = parseFloat(oDados.PercentualDiferimentoIcms, 0);
			oDados.PercentualReducaoBC = parseFloat(oDados.PercentualReducaoBC, 0);
			
			oDados.CfopDetails = {
				__metadata: {
					uri: "/Cfops('" + oDados.Cfop + "')"
				}
			};
			
			oDados.CstConfinsDetails = {
				__metadata: {
					uri: "/CstCofinss('" + oDados.CstCofins + "')"
				}
			};
			
			oDados.CstIcmsDetails = {
				__metadata: {
					uri: "/CstIcmss('" + oDados.CstIcms + "')"
				}
			};
			
			oDados.CstIpiDetails = {
				__metadata: {
					uri: "/CstIpis('" + oDados.CstIpi + "')"
				}
			};
			
			oDados.CstPisDetails = {
				__metadata: {
					uri: "/CstPiss('" + oDados.CstPis + "')"
				}
			};
			
			oModel.update(this._sPath, oDados, {
					success: function() {
					MessageBox.success("Natureza de operação alterada com sucesso!", {
						onClose: function(){
							that._goBack();
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack();
		}
	});

});