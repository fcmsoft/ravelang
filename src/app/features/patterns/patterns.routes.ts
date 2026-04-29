
import { PatternList } from "./pattern-list/pattern-list";
import { PatternDetails } from "./pattern-details/pattern-details";

export default [
    { path: '', component: PatternList, title: 'Patterns List' },
    { path: ':id', component: PatternDetails, title: 'Pattern Detail' },
];