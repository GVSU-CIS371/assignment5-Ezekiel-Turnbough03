<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <div v-if="!beverageStore.user">
      <button @click="withGoogle" :disabled="signed_in">
        {{ signed_in ? "Signing In..." : "Sign In With Google" }}
      </button>
      <p v-if="error_log">{{ error_log }}</p>
    </div>

    <div v-else>
      <p>Signed in as: {{ beverageStore.user.displayName || beverageStore.user.email }}</p>
      <button @click="LogOut">Sign Out</button>
    </div>

    <input
      v-model="beverageStore.currentName"
      type="text"
      placeholder="Beverage Name"
    />

    <button @click="handleMakeBeverage" :disabled="!beverageStore.user">🍺 Make Beverage</button>
    <p v-if="message" class="status-message">
      {{ message }}
    </p>
  </div>

  <div style="margin-top: 20px">
    <template v-for="beverage in beverageStore.beverages" :key="beverage.id">
      <input
        type="radio"
        :id="beverage.id"
        :value="beverage"
        v-model="beverageStore.currentBeverage"
        @change="beverageStore.showBeverage()"
      />
      <label :for="beverage.id">{{ beverage.name }}</label>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { signInWithPopup, signOut } from "firebase/auth";
import { authentication, google_authentication } from "./firebase";

const beverageStore = useBeverageStore();
beverageStore.init();

const signed_in = ref(false);
const error_log = ref("");
const message = ref("");

const showMessage = (txt: string) => {
  message.value = txt;
  setTimeout(() => (message.value = ""), 5000);
};

const withGoogle = async () => {
  signed_in.value = true;
  error_log.value = "";

  try {
    const authenticated = await signInWithPopup(authentication, google_authentication);
    const user = authenticated.user;

    console.log("Signed in as: ", user.uid);
    await beverageStore.setUser(user);
  } catch (authentication_error: any) {
    console.error(authentication_error);
    error_log.value =
      "ERROR! Authentication failed.\n" + authentication_error.message;
  } finally {
    signed_in.value = false;
  }
};

const handleMakeBeverage = async () => {
  const txt = await beverageStore.makeBeverage();
  showMessage(txt);
};

async function LogOut() {
  await signOut(authentication);
  beverageStore.setUser(null);
}
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
}

.auth-row {
  margin-top: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-label {
  color: #ffffff;
  font-size: 0.9rem;
}

.hint {
  margin-top: 4px;
  color: #ffffff;
  font-size: 0.85rem;
}

.status-message {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  font-size: 0.9rem;
}
</style>
