<template>
  <div class="g-cont">
    <div class="g-rtside" style="overflow-y: auto">
      <div>
        <div class="promotional-video">
          <div class="video-text">东风名片</div>
        </div>
        <div class="promotional-video">
          <div class="video-text">概要情况介绍</div>
          <div class="video-main" style="margin-top: 30px">
            <quill-editor
              ref="mwQuillEditor"
              v-model="param.overviewIntroduction"
              class="bjq-tool ql-editors"
            />
          </div>
        </div>
        <div class="savepromotional" @click="submitpromot">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addDFCard,
  editDFCard,
  getDFCardList
} from "../../api/api.js";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      param: {
        businessCard: '',
        overviewIntroduction: ''
      }
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getDFCardList().then(res => {
        if (res.data) {
          this.param.businessCard = res.data.businessCard
          this.param.overviewIntroduction = res.data.overviewIntroduction
        }
      })
    },
    submitpromot() {
      if (!this.param.businessCard) {
        addDFCard(this.param).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        editDFCard(this.param).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
};
</script>

<style scoped>
</style>