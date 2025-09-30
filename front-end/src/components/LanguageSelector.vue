<script setup lang="ts"></script>

<template>
  <select class="form-select" v-model="$i18n.locale" :style="{ width: '120px' }">
    <option value="en">English</option>
    <option value="zh">简体中文</option>
  </select>
</template>
