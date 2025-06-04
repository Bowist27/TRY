export default {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest', // Si estás usando Babel
    },
    extensionsToTreatAsEsm: ['.js', '.jsx'],
};
  