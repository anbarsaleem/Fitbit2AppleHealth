<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Client</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Fitbit to Apple Health</ion-title>
        </ion-toolbar>
      </ion-header>
      <div style="text-align: center;">
        <ion-button :href="authResponse" @click="navigateToLink()">Login to Fitbit</ion-button>
        <ion-button @click="updateFitbitData()"> Refresh/Update Fitbit Data</ion-button>
      </div>
      <div>
        <ion-item>Here are your recent Fitbit workouts!</ion-item>
        <ion-card v-for="(workout, index) in fitbitWorkouts" :key="index">
          <ion-card-header>{{ workout.activityName }}</ion-card-header>
          <ion-card-content>
            <p>Calories Burned: {{ workout.calories }}</p>
            <p>Duration (in seconds): {{ workout.duration / 1000 }}</p>
            <p>Start Time: {{ new Date(workout.startTime) }}</p>
            <!-- Add more data fields as needed -->
            <div style="text-align: center;">
              <ion-button :color="workout.buttonColor" :disabled="workout.isButtonDisabled"
                @click="saveWorkout(workout)">{{ workout.buttonLabel }}</ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
      <!-- <ion-item>
        <ion-label stacked>Set Height</ion-label>
        <ion-input v-model="height" type="text" placeholder="My Height today (in cm)"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label stacked>Current Height</ion-label>
        <ion-input v-model="currentHeight" type="text" readonly></ion-input>
      </ion-item> -->
      <ion-item>
        <ion-label stacked>Steps last 24h</ion-label>
        <ion-input v-model="stepcount" readonly></ion-input>
      </ion-item>

      <!-- <ion-button expand="full" @click="saveHeight()">Set Height</ion-button> -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonCardContent, IonCardHeader, IonCard, IonButton, IonInput } from '@ionic/vue';
import { HealthKit } from '@ionic-native/health-kit';
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { reactive } from 'vue';
import { processExpression } from '@vue/compiler-core';

interface Workout {
  energy: number;
  energyUnit: string;
  activityType: string;
  quantityType: string;
  duration: number;
  distance: number;
  distanceUnit: string;
  startDate: Date;
}

export default defineComponent({
  components: {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonCardContent, IonCardHeader, IonCard, IonButton, IonInput,
  },
  data() {
    return {
      authResponse: "",
      fitbitData: "",
      fitbitWorkouts: reactive([]),
      height: '',
      currentHeight: 'No Data',
      stepcount: 'No Data',
      workouts: [] as Workout[],
      healthKit: HealthKit,
    };
  },
  async created() {
    try {
      const fitbitData = await this.callAPI(); // Wait for the API call to complete and get the data
      this.fitbitWorkouts = JSON.parse(this.fitbitData); // Parse the data
      // Populate the fitbitWorkouts array with the fetched workout data
      this.fitbitWorkouts = this.fitbitWorkouts.map((workout) => ({
        ...workout,
        buttonLabel: "Click to Save to Apple Health",
        buttonColor: "tertiary",
        isButtonDisabled: false,
      }));
    } catch (error) {
      console.error('Error fetching or parsing workout data:', error);
    }

    this.$nextTick(() => {
      this.healthKit.available().then((available) => {
        if (available) {
          const options = {
            readTypes: ['HKQuantityTypeIdentifierHeight', 'HKQuantityTypeIdentifierStepCount', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKWorkoutActivityTypeTraditionalStrengthTraining'],
          writeTypes: ['HKQuantityTypeIdentifierHeight', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierDistanceCycling'],
          };
          this.healthKit.requestAuthorization(options).then(() => {
            this.loadHealthData();
          });
        }
      });
    });
  },
  methods: {
    callAPI() {
      return new Promise((resolve, reject) => {
        fetch(import.meta.env.VITE_SERVER_URL + "/fitbitAuth")
          .then((res) => res.text())
          .then((res) => {
            this.authResponse = res;
            console.log("fetched fitbit auth response from API");
            console.log("Auth response: " + this.authResponse);

            return fetch(import.meta.env.VITE_SERVER_URL + "/fitbitDataRoute");
          })
          .then((res) => res.text())
          .then((res) => {
            this.fitbitData = res;
            console.log("fetched fitbit data response from API");
            resolve(res); // Resolve the Promise with the fitbitData
          })
          .catch((error) => {
            console.error("Error fetching fitbit data:", error);
            reject(error); // Reject the Promise with the error
          });
      });
    },
    navigateToLink() {
      window.location.href = this.authResponse;
    },
    async updateFitbitData() {
      try {
        const fitbitData = await this.callAPI(); // Wait for the API call to complete and get the data
        this.fitbitWorkouts = JSON.parse(this.fitbitData); // Parse the data
        this.fitbitWorkouts = this.fitbitWorkouts.map((workout: Workout) => ({
          ...workout,
          buttonLabel: "Click to Save to Apple Health",
          buttonColor: "tertiary",
          isButtonDisabled: false,
          }));
      } catch (error) {
        console.error('Error fetching or parsing workout data:', error);
      }
    },
    /*saveHeight() {
      this.healthKit.saveHeight({ unit: 'cm', amount: this.height }).then(() => {
        this.height = '';
        this.loadHealthData();
      });
    },*/
    saveWorkout(workout) {
      const formattedDuration = workout.duration / 1000;
      const workoutToSave: Workout = {
        activityType: 'HKWorkoutActivityTypeTraditionalStrengthTraining',
        quantityType: 'HKQuantityTypeIdentifierDistanceCycling', //Restricted to this specific quantity type due to the Cordova plugin unfortunately
        startDate: new Date(workout.startTime),  // Set the start date and time of the workout
        duration: formattedDuration, // Set the duration of the workout in seconds (optional)
        energy: workout.calories,            // Set the total energy burned during the workout (optional)
        energyUnit: 'kcal',     // Set the unit of measurement for energy (optional)
        distance: 0,
        distanceUnit: 'km',
      };
      console.log(workoutToSave);
      this.healthKit.saveWorkout(workoutToSave).then(() => {
        this.loadHealthData();
      });

      console.log('Button clicked for workout:', workout);
      workout.buttonLabel = "Saved!";
      workout.buttonColor = "success";
      workout.isButtonDisabled = true;
    },
    loadHealthData() {
      /*this.healthKit.readHeight({ unit: 'cm' }).then((val) => {
        this.currentHeight = val.value;
      }).catch((err) => {
        console.log('No height:', err);
      });*/

      const stepOptions = {
        startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        endDate: new Date(),
        sampleType: 'HKQuantityTypeIdentifierStepCount',
        unit: 'count',
      };

      this.healthKit.querySampleType(stepOptions).then((data) => {
        const stepSum = data.reduce((a: any, b: { quantity: any; }) => a + b.quantity, 0);
        this.stepcount = stepSum;
      }).catch((err) => {
        console.log('No steps:', err);
      });

      this.healthKit.findWorkouts().then((data) => {
        this.workouts = data;
        console.log(this.workouts);
      }).catch((err) => {
        console.log('no workouts:', err);
        // Sometimes the result comes in here, very strange.
        this.workouts = err;
      });
    },
  },
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
