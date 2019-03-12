import {Node}            from 'tiptap';
import {toggleBlockType} from 'tiptap-commands';

export default class Heading extends Node {

    get name() {
        return 'align';
    }

    get defaultOptions() {
        return {
            alignments: ['left', 'center', 'right']
        };
    }

    get schema() {
        return {
            attrs: {
                align: {
                    default: 'left'
                }
            },
            content: 'inline*',
            group: 'block',
            defining: true,
            draggable: false,
            parseDOM: [{
                tag: 'p',
                priority: 60,
                getAttrs(dom) {
                    return {
                        align: dom.align
                    };
                }
            }],
            toDOM: node => [`p`, {align: node.attrs.align}, 0]
        };
    }

    commands({type, schema}) {
        return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs);
    }

}
