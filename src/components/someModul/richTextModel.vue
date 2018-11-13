<template>
    <!-- 不进行这样的使用 -->
    <!-- 富文本编辑器组建 -->
    <div>     
        <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
        <div class="html ql-editor" v-html="content"></div>
    </div>
</template>

<script>
import Quill from 'quill';
import { ImageImport } from '../someModul/ImageImport.js';
import { ImageResize } from '../someModul/ImageResize.js';
Quill.register('modules/imageImport', ImageImport);
Quill.register('modules/imageResize', ImageResize);
export default {
    data() {
        return {
            name: 'richtext',
            content: '<h2>I am Example 1</h2>',
            editorOption: {
                 modules: {
                    imageImport: true,
                    imageResize: {
                        displaySize: true
                    }
                }

            },
            imageImport: true,
            imageResize: {
                displaySize: true
            }
        }
    },
    methods: {
        // onEditorBlur(editor) {
        //     console.log('editor blur!', editor)
        // },
        // onEditorFocus(editor) {
        //     console.log('editor focus!', editor)
        // },
        // onEditorReady(editor) {
        //     console.log('editor ready!', editor)
        // }
    },
    computed: {
        editor() {
            return this.$refs.myTextEditor.quill
        }
    },
    mounted() {
        console.log('this is my editor', this.editor)
        setTimeout(() => {
            this.content = '<h1>Example 1 changed!</h1>'
        }, 1800)
    }
}
</script>

<style lang="css">
.ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 25em;
}

.html {
    height: 9em;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-top: none;
    resize: vertical;
}
</style>