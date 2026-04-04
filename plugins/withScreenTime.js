const { withXcodeProject, IOSConfig } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * Expo config plugin that adds ScreenTimeModule.swift and ScreenTimeModule.m
 * to the Xcode project target automatically on every prebuild.
 */
const withScreenTime = (config) => {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const projectRoot = config.modRequest.projectRoot;
    const platformProjectRoot = config.modRequest.platformProjectRoot;
    const projectName = config.modRequest.projectName;

    const swiftSrc = path.join(projectRoot, 'plugins', 'ScreenTimeModule.swift');
    const mSrc = path.join(projectRoot, 'plugins', 'ScreenTimeModule.m');
    const targetDir = path.join(platformProjectRoot, projectName);

    const swiftDest = path.join(targetDir, 'ScreenTimeModule.swift');
    const mDest = path.join(targetDir, 'ScreenTimeModule.m');

    // Copy source files into the ios project folder
    if (fs.existsSync(swiftSrc)) fs.copyFileSync(swiftSrc, swiftDest);
    if (fs.existsSync(mSrc)) fs.copyFileSync(mSrc, mDest);

    // Add to Xcode project target
    const groupName = projectName;
    const group = xcodeProject.pbxGroupByName(groupName);
    if (!group) return config;

    const swiftFile = 'ScreenTimeModule.swift';
    const mFile = 'ScreenTimeModule.m';

    // Only add if not already present
    const alreadyHasSwift = group.children?.some(c => c.comment === swiftFile);
    const alreadyHasM = group.children?.some(c => c.comment === mFile);

    if (!alreadyHasSwift) {
      xcodeProject.addSourceFile(swiftFile, { target: xcodeProject.getFirstTarget().uuid }, groupName);
    }
    if (!alreadyHasM) {
      xcodeProject.addSourceFile(mFile, { target: xcodeProject.getFirstTarget().uuid }, groupName);
    }

    return config;
  });
};

module.exports = withScreenTime;
