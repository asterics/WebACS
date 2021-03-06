/*
 * AsTeRICS - Assistive Technology Rapid Integration and Construction Set (http://www.asterics.org)
 *
 *
 * Y88b                     d88P      888               d8888  .d8888b.   .d8888b.
 *  Y88b                   d88P       888              d88888 d88P  Y88b d88P  Y88b
 *   Y88b                 d88P        888             d88P888 888    888 Y88b.
 *    Y88b     d888b     d88P .d88b.  8888888b.      d88P 888 888         "Y888b.
 *     Y88b   d88888b   d88P d8P  Y8b 888   Y88b    d88P  888 888            "Y88b.
 *      Y88b d88P Y88b d88P  88888888 888    888   d88P   888 888    888       "888
 *       Y88888P   Y88888P   Y8b.     888   d88P  d8888888888 Y88b  d88P Y88b  d88P
 *        Y888P     Y888P     "Y8888  8888888P"  d88P     888  "Y8888P"   "Y8888P"
 *
 * Copyright 2015 Kompetenznetzwerk KI-I (http://ki-i.at)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ACS View Constants
ACS.vConst = {
  // view
  VIEW_PATHTOACSHELPSTARTPAGE: "/manuals/WebACS/",
  VIEW_ONLINE_HELP_PATH: "https://www.asterics.eu",
  // canvasView
  CANVASVIEW_MOTHERPANEL: "canvasMotherPanel",
  CANVASVIEW_TABLIST: "canvasPanelTabList",
  CANVASVIEW_CLASSOFTAB: "canvasTab",
  CANVASVIEW_CLASSOFPANEL: "canvasPanel",
  // componentView
  COMPONENTVIEW_ELEMENTHEIGHT: 120,
  COMPONENTVIEW_ELEMENTWIDTH: 90,
  COMPONENTVIEW_TOPRECTHEIGHT: 32,
  COMPONENTVIEW_PORTHEIGHTPLUSGAP: 20,
  COMPONENTVIEW_FIRSTINPUTPORTPOSITIONY: 40,
  COMPONENTVIEW_FIRSTOUTPUTPORTPOSITIONY: 50,
  COMPONENTVIEW_HEADERTEXTPOSITIONX: 10,
  COMPONENTVIEW_HEADERTEXTPOSITIONY: 10,
  COMPONENTVIEW_HEADERTEXTWIDTH: 70,
  COMPONENTVIEW_INPUTPORTLEFTOFCOMPONENT: 10,
  COMPONENTVIEW_INPUTPORTLABELPOSITIONX: 15,
  COMPONENTVIEW_OUTPUTPORTPOSITIONX: 80,
  COMPONENTVIEW_OUTPUTPORTLABELPOSITIONX: 10,
  COMPONENTVIEW_FIRSTINPUTPORTY: 40,
  COMPONENTVIEW_PORTWIDTH: 20,
  COMPONENTVIEW_PORTHEIGHT: 10,
  COMPONENTVIEW_EVENTPORTWIDTH: 10,
  COMPONENTVIEW_EVENTPORTHEIGHT: 20,
  COMPONENTVIEW_EVENTPORTYINSIDECOMPONENT: 10,
  COMPONENTVIEW_EVENTLISTENERPORTPOSITIONX: 20,
  COMPONENTVIEW_EVENTTRIGGERPORTPOSITIONX: 60,
  COMPONENTVIEW_FONTSIZE: 9,
  COMPONENTVIEW_PORTLABELWIDTH: 65,
  COMPONENTVIEW_STROKECOLOR: "black",
  COMPONENTVIEW_TEXTCOLOR: "black",
  COMPONENTVIEW_COMPONENTCOLOR: "rgba(168,222,222,0.8)",
  COMPONENTVIEW_COMPONENTHEADERCOLOR: "rgb(255,254,46)",
  COMPONENTVIEW_INPUTPORTCOLOR: "rgb(138,175,241)",
  COMPONENTVIEW_OUTPUTPORTCOLOR: "rgb(197,89,89)",
  COMPONENTVIEW_EVENTINPUTPORTCOLOR: "rgb(82,253,65)",
  COMPONENTVIEW_EVENTOUTPUTPORTCOLOR: "rgb(214,66,251)",
  COMPONENTVIEW_SELECTEDPORTCOLOR: "rgb(9,20,253)",
  COMPONENTVIEW_SELECTIONFRAMECOLOR: "rgba(209,210,241,0.5)",
  COMPONENTVIEW_SELECTIONFRAMECOLORPORTMODE: "rgba(209,138,107,0.5)",
  COMPONENTVIEW_SELECTIONFRAMESTROKECOLOR: "rgb(107,107,119)",
  COMPONENTVIEW_SELECTIONFRAMEWIDTH: 15,
  COMPONENTVIEW_ERRORMARKERCOLOR: "rgba(255,150,0,0.6)",
  COMPONENTVIEW_ERRORMARKERWIDTH: 20,
  // channelView
  CHANNELVIEW_STROKECOLOR: "black",
  CHANNELVIEW_STROKEWIDTH: 2,
  CHANNELVIEW_HITREGIONWIDTH: 15,
  // dataChannelView
  DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT: 10,
  DATACHANNELVIEW_OUTPUTPORTPOSITIONX: 100,
  DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY: 45,
  DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY: 55,
  DATACHANNELVIEW_STROKECOLOR: "black",
  DATACHANNELVIEW_SELECTEDSTROKECOLOR: "rgb(8, 246, 13)",
  // eventChannelView
  EVENTCHANNELVIEW_TRIGGERPOSX: 65,
  EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT: 10,
  EVENTCHANNELVIEW_LISTENERPOSX: 25,
  EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT: 8,
  EVENTCHANNELVIEW_STROKECOLOR: "rgb(229, 117, 117)",
  EVENTCHANNELVIEW_SELECTEDSTROKECOLOR: "rgb(177, 20, 229)",
  // menuView
  MENUVIEW_MENUMOTHERPANEL: "mainMenuPanel",
  MENUVIEW_CLASSOFTAB: "tab",
  MENUVIEW_CLASSOFPANEL: "panel",
  MENUVIEW_BEFOREUNLOADMESSAGE:
    "At least one model has not been saved. If you leave now, you will loose all unsaved changes!",
  MENUVIEW_ALERTSTRINGPORTSMUSTBECONNECTED:
    "Cannot upload model - the following ports\nneed an incoming data connection first:\n\n",
  MENUVIEW_CONFIRMNEWCOMPONENTCOLLECTIONDELETE:
    "The following components are no longer part of the component collection and will be deleted from the model:\n\n",
  MENUVIEW_CONFIRMNEWCOMPONENTCOLLECTIONMODIFY:
    "The definiton of the following components does not match the new component collection -\nundefined properties or ports will be reset to default values:\n\n",
  MENUVIEW_ALERTNEWCOMPONENTCOLLECTIONSET:
    "The new component collection has been set -\nthe menu has been updated accordingly.",
  // modelView
  MODELVIEW_CLASSOFTAB: "modelTab",
  MODELVIEW_CLASSOFPANEL: "modelPanel",
  MODELVIEW_MODELDESIGNERHEADER: "Model Designer",
  MODELVIEW_GUIDESIGNERHEADER: "GUI Designer",
  MODELVIEW_LISTVIEWHEADER: "List view",
  MODELVIEW_MODELDESIGNERSIZEX: 4000,
  MODELVIEW_MODELDESIGNERSIZEY: 2000,
  MODELVIEW_FOCUSRECTCOLOR: "rgba(213, 241, 239, 0.3)",
  MODELVIEW_FOCUSRECTSTROKECOLOR: "rgb(17, 234, 196)",
  MODELVIEW_ALERTSTRINGREMOVEDCOMPONENTS:
    "The definition of the following components was not found in the component\ncollection - they have therefore been removed from the model:\n\n",
  MODELVIEW_ALERTSTRINGCHANGEDCOMPONENTS:
    "The definition of the following components did not match the component\ncollection - undefined properties or ports have been reset to default values:\n\n",
  MODELVIEW_ALERTSTRINGSINGLETONCOMPONENTS:
    "The following components are allowed only once\nper model - they have therefore not been pasted:\n\n",
  // property editor
  PROPERTYEDITOR_MOTHERPANEL: "propertyEditorMotherPanel",
  PROPERTYEDITOR_TABLIST: "propertyEditorTabList",
  PROPERTYEDITOR_CLASSOFTAB: "propEdTab",
  PROPERTYEDITOR_CLASSOFPANEL: "propEdPanel",
  PROPERTYEDITOR_PROPERTIESHEADER: "Properties",
  PROPERTYEDITOR_INPUTHEADER: "Input",
  PROPERTYEDITOR_OUTPUTHEADER: "Output",
  PROPERTYEDITOR_TRIGGERHEADER: "Event Triggers",
  PROPERTYEDITOR_LISTENERHEADER: "Event Listeners",
  PROPERTYEDITOR_EVENTHEADER: "Events",
  // editorProperties
  EDITORPROPERTIES_ENABLEGRID: true,
  EDITORPROPERTIES_SHOWGRID: true,
  EDITORPROPERTIES_GRIDSTEPS: ACS.gridStepType.MEDIUM,
  EDITORPROPERTIES_SCREENRES: ACS.screenResType.SIXTEENNINE,
  EDITORPROPERTIES_SCREENRESFIVEFOUR_X: 960,
  EDITORPROPERTIES_SCREENRESFIVEFOUR_Y: 640,
  EDITORPROPERTIES_SCREENRESSIXTEENNINE_X: 960,
  EDITORPROPERTIES_SCREENRESSIXTEENNINE_Y: 540,
  EDITORPROPERTIES_SCREENRESFOURTHREE_X: 864,
  EDITORPROPERTIES_SCREENRESFOURTHREE_Y: 648,
  // guiView
  GUIVIEW_AREWINDOWNAME: "ARE",
  GUIVIEW_AREWINDOWBACKGROUND: "rgba(220,220,220,0.5)",
  GUIVIEW_COMPONENTGUIBACKGROUND: "rgba(220,0,0,0.5)",
  GUIVIEW_EXTERNALCOMPONENTGUIBACKGROUND: "rgba(0,125,256,0.5)",
  GUIVIEW_GRIDLINECOLOR: "rgba(220,220,220,0.8)",
  GUIVIEW_GRIDSTEPS_SMALL: 5,
  GUIVIEW_GRIDSTEPS_MEDIUM: 10,
  GUIVIEW_GRIDSTEPS_LARGE: 20,
  GUIVIEW_GRIDSTEPS_HUGE: 40,
  GUIVIEW_DECORATIONHEIGHT: 360,
  GUIVIEW_CONTROLSWIDTH: 400,
  // guiViewElement
  GUIVIEWELEMENT_FONTSIZE: 12,
  GUIVIEWELEMENT_CONTROLSCOLOR: "rgba(90,90,90,0.5)",
  GUIVIEWELEMENT_CONTROLSNAME: "Control",
  GUIVIEWELEMENT_CONTROLSFONTSIZE: 11,
  GUIVIEWELEMENT_NAMECOLOR: "black",
  GUIVIEWELEMENT_NORMSCREENRES_X: 10000,
  GUIVIEWELEMENT_NORMSCREENRES_Y: 10000,
  GUIVIEWELEMENT_AREWINDOWDECOIMAGE: "view/images/are_deco.png",
  GUIVIEWELEMENT_FOCUSCOLOR: "rgba(100,100,222,0.5)",
  //local storage keys
  WEBACS_OPTIONS_TESTMODE: 'WEBACS_OPTIONS_TESTMODE',
  WEBACS_OPTIONS_TESTMODE_TIMEOUT: 'WEBACS_OPTIONS_TESTMODE_TIMEOUT',
  WEBACS_OPTIONS_TESTMODE_FONTSIZE_PX: 'WEBACS_OPTIONS_TESTMODE_FONTSIZE_PX'
};
