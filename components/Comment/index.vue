<template>
  <section class="wrapper" style="padding: 0;">
    <div class="box inner">
      <div class="comment_content"><h2 class="align-center" style="margin-top: 10px;">💬 COMMENT</h2>
        <hr/>
        <form action="#" method="post">
          <div v-if="comment_inputs_show">
            <div class="field half first"><label for="name">Name</label><input name="name" id="name" type="text"
                                                                               placeholder="昵称"
                                                                               v-model="user_comment.name"/></div>
            <div class="field half"><label for="email">Email</label><input name="email" id="email" type="email"
                                                                           placeholder="邮箱"
                                                                           v-model="user_comment.email"/></div>
          </div>
          <div v-else><p><strong>Hi！{{ user_comment.name }}</strong></p></div>
          <div><label for="message">Message</label><textarea ref="message" name="message" id="message" rows="6"
                                                                           placeholder="输入评论......"
                                                                           v-model="user_comment.content"></textarea>
          </div>
          <div v-if="msg" class="msg_color">{{ msg }}</div>
          <div v-else class="tip">🦄 支持Makedown语法</div>
          <div class="actions align-center">
            <input value="发送" :disabled="disabled" class="button special" type="button" @click="comment"/>
          </div>
        </form>
      </div>
      <div class="m-cmmt" id="comments">
        <div class="cmmts">
          <div class="comment_item" v-for="(item,index) in comment_list" :id="`rp_`+item.id">
            <div class="head"><a class="avatar"><img v-lazy="item.user_avatar" :alt="item.user_name"/></a></div>
            <div class="cntwrap">
              <div class="rp_content">
                <div class="cnt f-brk"><a :href="`#rp_`+item.id" class="rp_name">{{ item.user_name }}</a><a
                  v-html="item.nameplate"></a></div>
                <div class="cn" v-html="item.user_comment" v-highlight></div>
              </div>
              <div class="rp_config">
                <div class="time s-fc4 pointer" :title="item.date_create_time">{{ item.create_time }}</div>
                <a href="javascript:void(0)" @click="rpClick(item.id)" v-if="item.id!==current">回复</a><a
                href="javascript:void(0)" @click="rpClick(item.id,false)" v-else>收起</a>
                <div :class="{show:item.id===current}" class="editor_hidden text"><textarea class="rp_editor"
                                                                                            :placeholder="`回复` + item.user_name + `....`"
                                                                                            v-model="rp_content"></textarea>
                  <div class="rp_msg mt10px msg_color">
                    <button :disabled="send_status.f_send" class="rp_btn special"
                            @click="Send(item.id,id,rp_content,item.user_name,false)">发送
                    </button>
                    <small class="left" v-if="rp_msg.f_rp_msg">{{ rp_msg.f_rp_msg }}</small></div>
                </div>
                <div class="clear"></div>
              </div>
              <div class="sub_rp_content">
                <div class="rp_sub" v-for="(vo,key) in item.reply" :id="`sub_rp_`+vo.id">
                  <a :href="`#sub_rp_`+vo.id" class="reply_name">{{ vo.reply_name }}</a>
                  <a v-html="vo.nameplate"></a>
                  <div class="select-wrapper s-fc4">回复&nbsp;<span class="uName">{{ vo.uName }}：</span><span
                    class="rp_time pointer" :title="vo.date_create_time">{{ vo.create_time }}</span></div>
                  <div class="select-wrapper text"><span class="rp_content_item" v-html="vo.content" v-highlight></span><span
                    class="rp_time"><a v-if="vo.id!==sub_current" href="javascript:void(0)" @click="sub_rpClick(vo.id)"
                                       class="s-fc3"><i class="fa fa-comment-o"></i><span>回复</span></a><a v-else
                                                                                                          href="javascript:void(0)"
                                                                                                          @click="sub_rpClick(vo.id,false)"
                                                                                                          class="s-fc3"><i
                    class="fa fa-commenting"></i><span>收起</span></a></span></div>
                  <div :class="{show:vo.id===sub_current}" class="editor_hidden text"><textarea class="rp_editor"
                                                                                                :placeholder="`回复` + vo.reply_name + `....`"
                                                                                                v-model="sub_rp_content"></textarea>
                    <div class="rp_msg mt10px msg_color">
                      <button :disabled="send_status.s_send" class="rp_btn special right"
                              @click="Send(item.id,id,sub_rp_content,vo.reply_name,true)">发送
                      </button>
                      <small class="left" v-if="rp_msg.s_rp_msg">{{ rp_msg.s_rp_msg }}</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import {addComment, addReply} from "@/api";

export default {
  data() {
    return {
      current: undefined,
      sub_current: undefined,
      sub_Id: undefined,
      rp_content: "",
      sub_rp_content: "",
      send_status: {
        f_send: true, //发送按钮
        s_send: true
      },
      user_name: "",
      msg: "",
      rp_msg: {
        f_rp_msg: "",
        s_rp_msg: ""
      },
      user_comment: {
        name: "",
        email: "",
        content: ""
      },
      reply_data: {
        reply_name_by_session: "",
        reply_email_by_session: ""
      },
      disabled: false
    };
  },
  props: {
    id: {type: String, default: ""}, //文章id
    comment_list: {type: Array, default: []}, //评论列表
    comment_inputs_show: {type: Boolean, default: true} // 有localStorage就隐藏姓名和邮箱的输入框
  },
  watch: {
    rp_content: function (data) {
      data ? (this.send_status.f_send = false) : this.send_status.f_send;
    },
    sub_rp_content: function (data) {
      data ? (this.send_status.s_send = false) : this.send_status.s_send;
    }
  },
  mounted() {
    let reply_data = JSON.parse(localStorage.getItem("reply_data"));
    //输入框处于隐藏状态并且填写了评论信息
    if (reply_data) {
      this.user_comment.name = this.reply_data.reply_name_by_session =
        reply_data.reply_name_by_session;
      this.user_comment.email = this.reply_data.reply_email_by_session =
        reply_data.reply_email_by_session;
    }
  },
  methods: {
    /**
     * 评论
     */
    comment() {
      this.disabled = true;
      const p = {
        content: this.user_comment.content,
        name: this.user_comment.name,
        email: this.user_comment.email,
      }
      // cid是栏目ID，aid是文章ID
      if(this.$route.path === '/page') {
        p.cid = this.id
      } else {
        p.aid = this.id;
        p.cid = this.$route.query.cid
      }
      addComment(p).then(res => {
        if (res.status) {
          this.user_comment.content = "";
          localStorage.setItem(
            "reply_data",
            JSON.stringify(res.reply_data)
          );
          this.$emit("refresh_comment", this.id);
          setTimeout(() => {
            this.disabled = false;
          }, 800)
        } else {
          this.$refs.message.focus()
          this.disabled = false;
        }
        this.msg = res.msg;
      });
    },
    /**
     * @param mid 评论id，只取父级的
     * @param aid 文章id
     * @param content 内容
     * @param uName 被回复的人
     * @param is_sub 是不是评论的子级(没有头像的那一级)
     * @constructor
     */
    Send(mid, aid, content, uName, is_sub) {
      let reply_name_by_session = this.reply_data
        ? this.reply_data.reply_name_by_session
        : "";
      let reply_email_by_session = this.reply_data
        ? this.reply_data.reply_email_by_session
        : "";
      this.send_status.f_send = true;
      this.send_status.s_send = true;
      const p = {
        content: content,
        uName: uName,
        mid: mid,
        aid: aid,
        cid: this.$route.query.cid,
        reply_email_by_session: reply_email_by_session,
        reply_name_by_session: reply_name_by_session
      }
      addReply(p)
        .then(res => {
          // 回复成功后清除内容
          if (res.status) {
            if (!is_sub) {
              this.rp_msg.f_rp_msg = res.msg;
              this.rp_content = "";
            } else {
              this.rp_msg.s_rp_msg = res.msg;
              this.sub_rp_content = "";
            }
            if (is_sub) {
              setTimeout(() => {
                this.send_status.s_send = false;
              }, 800)
            } else {
              setTimeout(() => {
                this.send_status.f_send = false;
              }, 800)
            }
            this.$emit("refresh_comment", aid);
          } else {
            if (is_sub) {
              this.send_status.s_send = false;
            } else {
              this.send_status.f_send = false;
            }
          }
          is_sub
            ? (this.rp_msg.s_rp_msg = res.msg)
            : (this.rp_msg.f_rp_msg = res.msg);
        });
    },
    rpClick(index, open = true) {
      this.rp_msg.f_rp_msg = "";
      this.current = open ? index : undefined; //是否展开
    },
    sub_rpClick(key, open = true) {
      this.rp_msg.s_rp_msg = "";
      this.sub_current = open ? key : undefined; //是否展开
    }
  },
}
</script>

<style>
@import "~@/assets/css/comment.css";
</style>
