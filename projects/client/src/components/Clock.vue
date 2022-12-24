<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
  time: number;
  active: boolean;
  editable: boolean;
}>();

const emit = defineEmits(["update:name"]);

const innerName = computed({
  get() {
    return props.name;
  },
  set(value) {
    emit("update:name", value);
  },
});

function formatTime(time: number): string {
  let displayTime;
  if (time < 10) {
    displayTime = `
        ${Math.floor(time)}.${Math.floor((time - Math.floor(time)) * 100)
      .toString()
      .padStart(2, "0")}`;
  } else {
    displayTime = `
        ${Math.floor(time / 60)}:${Math.floor(time % 60)
      .toString()
      .padStart(2, "0")}`;
  }
  return displayTime;
}
</script>

<template>
  <v-card
    :dark="active"
    :color="active ? 'primary' : 'default'"
    class="fill-height"
  >
    <v-card-text>
      <h1 class="title">
        {{ formatTime(time) }}
      </h1>
      <v-text-field
        solo
        v-model.lazy="innerName"
        :disabled="!editable"
        class="textField"
      />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.title {
  font-size: 90px;
  line-height: 120px;
}

.textField {
  :deep(input) {
    font-size: 60px;
    line-height: 80px;
  }

  :deep(*) {
    opacity: 1;
  }
}
</style>
