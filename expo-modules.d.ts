declare module "expo-modules-core/src" {
  export * from "expo-modules-core";
}

declare module "expo-modules-core/src/index" {
  export * from "expo-modules-core";
}

declare module "expo-modules-core" {
  export const EventEmitter: any;
  export const NativeModulesProxy: any;
  export const Platform: any;
  export const CodedError: any;
  export const UnavailabilityError: any;
}
