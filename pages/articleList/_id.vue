<template>
  <section>
    <StartArticleList/>
    <ArticleList :cid="$route.params.id"/>
  </section>
</template>

<script>
import StartArticleList from '@/components/StartArticleList';
import ArticleList from "@/components/ArticleList";
export default {
  components: {
    StartArticleList,
    ArticleList,
  },
}
</script>

<style scoped>

</style>
