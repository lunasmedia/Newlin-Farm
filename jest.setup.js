// Silence expo-router warnings in tests by mocking native modules if needed
jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('firebase/app', () => ({
	getApp: jest.fn(() => ({})),
	getApps: jest.fn(() => []),
	initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
	getAuth: jest.fn(() => ({})),
	onAuthStateChanged: jest.fn((_auth, callback) => {
		callback(null);
		return jest.fn();
	}),
	createUserWithEmailAndPassword: jest.fn(),
	signInWithEmailAndPassword: jest.fn(),
	sendPasswordResetEmail: jest.fn(),
	updateProfile: jest.fn(),
}));
