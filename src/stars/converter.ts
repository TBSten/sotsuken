import { Stars, StarsSchema } from "@/pages/stars/types";
import { FirestoreDataConverter } from "@google-cloud/firestore";

export const starsConverter: FirestoreDataConverter<Stars> = {
    fromFirestore(snapshot) {
        return StarsSchema.parse({
            ...snapshot.data(),
            // starsId: snapshot.id,
        })
    },
    toFirestore(stars) {
        return {
            ...stars,
        }
    },
}
