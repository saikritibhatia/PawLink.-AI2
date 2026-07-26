/**
 * The shelter roster lives on the server, not in the browser bundle.
 * If the client sent this list up with each request, anyone could rewrite it
 * and use your API key to run arbitrary prompts. It ships down in responses,
 * never up in requests.
 *
 * Swap this array for a Supabase query once you have real shelter partners.
 */
export const SHELTER_PETS = [
  {
    id: "SP-01", name: "Biscuit", species: "Dog", breed: "Golden retriever mix",
    age: "3 years", weight: "62 lb", energy: "High",
    profile: "Bounces off the walls until he gets a real run. Loves everyone, kids included. Pulls hard on leash. Gets into the trash if left alone too long. Not tested with cats.",
    needs: "Active owner, secure yard, hard daily exercise",
    shelter: "Halston County Animal Services",
  },
  {
    id: "SP-02", name: "Poppy", species: "Dog", breed: "French bulldog",
    age: "5 years", weight: "24 lb", energy: "Low",
    profile: "Two short walks and she is done for the day. Snorts, snores, sits on feet. Great in apartments. Mild breathing trouble in heat, so no hard exercise and air conditioning in summer.",
    needs: "First-time owner friendly, climate controlled home",
    shelter: "Second Chance Rescue",
  },
  {
    id: "SP-03", name: "Rocket", species: "Dog", breed: "Belgian malinois mix",
    age: "2 years", weight: "55 lb", energy: "Very high",
    profile: "Brilliant, intense, and a lot of dog. Herds children. Needs a job, structured training, and hours of work a day. Will redecorate a house he is bored in.",
    needs: "Experienced handler only, no small kids, no apartments",
    shelter: "Halston County Animal Services",
  },
  {
    id: "SP-04", name: "Willow", species: "Cat", breed: "Domestic shorthair",
    age: "7 years", weight: "10 lb", energy: "Low",
    profile: "A lap cat with a schedule. Wants a quiet home, one warm window, and a person who sits still sometimes. Hisses at dogs. Perfectly fine alone during a workday.",
    needs: "Quiet indoor home, no dogs",
    shelter: "Sycamore Street Cat Rescue",
  },
  {
    id: "SP-05", name: "Mango", species: "Cat", breed: "Orange tabby",
    age: "1 year", weight: "7 lb", energy: "High",
    profile: "Kitten brain in a teenage body. Climbs curtains, ambushes ankles, needs puzzle feeders and ideally a second cat to wrestle. Good with older kids and other cats.",
    needs: "Enrichment, ideally another young cat",
    shelter: "Sycamore Street Cat Rescue",
  },
  {
    id: "SP-06", name: "Duke", species: "Dog", breed: "Beagle, senior",
    age: "9 years", weight: "28 lb", energy: "Low",
    profile: "Sleeps eleven hours a day and follows his nose the other one. Short slow walks only. Food motivated to a fault. Cries when left alone for a full workday.",
    needs: "Someone home often, budget for senior care",
    shelter: "Second Chance Rescue",
  },
  {
    id: "SP-07", name: "Nala", species: "Dog", breed: "Pit mix",
    age: "4 years", weight: "50 lb", energy: "Moderate",
    profile: "Gentle and quiet once she trusts you, which takes about two weeks. Leans her whole weight on people. Does not want to share her home with other dogs. Walks nicely on a harness.",
    needs: "Only pet, patient adopter, calm household",
    shelter: "Halston County Animal Services",
  },
  {
    id: "SP-08", name: "Pepper", species: "Cat", breed: "Tuxedo shorthair",
    age: "3 years", weight: "9 lb", energy: "Moderate",
    profile: "Independent and unbothered. Greets you at the door, then returns to her own business. Handles long workdays without drama. Prefers older kids and no dogs.",
    needs: "Low maintenance home, fine for busy people",
    shelter: "Sycamore Street Cat Rescue",
  },
  {
    id: "SP-09", name: "Cocoa", species: "Dog", breed: "Dachshund",
    age: "6 years", weight: "16 lb", energy: "Moderate",
    profile: "Small, loud, and deeply committed to routine. Barks at the hallway, the mail, and the concept of a doorbell. Apartment sized but not apartment quiet without training.",
    needs: "Tolerant neighbors, consistent schedule, back care",
    shelter: "Second Chance Rescue",
  },
  {
    id: "SP-10", name: "Juniper", species: "Dog", breed: "Border collie",
    age: "3 years", weight: "40 lb", energy: "Very high",
    profile: "Will learn any trick in ten minutes and then invent problems if you stop. Needs mental work, not just walks. Would be thrilled by agility, running, or a farm.",
    needs: "A job, an active person, mental stimulation every day",
    shelter: "Halston County Animal Services",
  },
];
