<template>
  <Mug>
    <Cold v-if="isIced" />
    <Hot v-else />
    <Contents>
      <template v-if="noCreamer && noSyrup" v-slot:bottom>
        <Base :color="beverageStore.currentBase?.color || '#8B4513'" />
      </template>

      <template v-else-if="noSyrup && hasCreamer" v-slot:bottom>
        <Creamer :color="beverageStore.currentCreamer?.color"/>
      
        <Base :color="beverageStore.currentBase?.color || '#8B4513'" />
      </template>

      <template v-if="hasSyrup && hasCreamer" v-slot:top>
        <Creamer :color="beverageStore.currentCreamer?.color"/>
      </template>
    
      <template v-if="hasSyrup" v-slot:mid>
        <Syrup :color="beverageStore.currentSyrup?.color || '#FFEFD5'" />
      </template>

      <template v-if="hasSyrup" v-slot:bottom>
        <Base :color="beverageStore.currentBase?.color || '#8B4513'" />
      </template>

    </Contents>
  </Mug>
</template>
<script setup lang="ts">
import Contents from "./Contents.vue";
import Mug from "./Mug.vue";
import Syrup from "./Syrup.vue";
import Base from "./Base.vue";
import Creamer from "./Creamer.vue";
import Hot from "./Hot.vue";
import Cold from "./Cold.vue";

import { useBeverageStore } from "../stores/beverageStore";
import { computed } from "vue"; 

const beverageStore = useBeverageStore();

type Props = {
  isIced: boolean;
};
defineProps<Props>();

const noCreamer = computed(() => beverageStore.currentCreamer?.color === "transparent");
const noSyrup = computed(() => beverageStore.currentSyrup?.color === "transparent");
const hasSyrup = computed(() => !noSyrup.value);
const hasCreamer = computed(() => !noCreamer.value);

</script>