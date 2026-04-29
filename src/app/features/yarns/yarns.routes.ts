import { YarnList } from "./yarn-list/yarn-list";
import { YarnDetails } from "./yarn-details/yarn-details";

export default [
    { path: '', component: YarnList, title: 'Yarns List' },
    { path: ':id', component: YarnDetails, title: 'Yarn Detail' },
];
