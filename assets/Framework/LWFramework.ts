
window['lw'] = {};

import BaseComp from './View/BaseComp';
(window['lw'] as any).BaseComp = BaseComp;

import BaseView from './View/BaseView';
(window['lw'] as any).BaseView = BaseView;

import ViewManager from './View/ViewManager';
(window['lw'] as any).viewMgr = ViewManager;

import EventManager from './EventManager';
(window['lw'] as any).evtMgr = EventManager;

import ResLoader from './ResLoader';
(window['lw'] as any).resLoader = ResLoader;

import {Metadata, getMatedata} from './LWDecorator';
(window['lw'] as any)._decorator = {};
let self_decorator = (window['lw'] as any)._decorator
self_decorator.metadata = Metadata;
self_decorator.getMatedata = getMatedata;