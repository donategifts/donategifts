module.exports = {
  disallowClassAttributeWithStaticValue: true,
  disallowIdAttributeWithStaticValue: true,

  requireClassLiteralsBeforeAttributes: true,
  requireIdLiteralsBeforeAttributes: true,
  disallowClassLiteralsBeforeIdLiterals: true,

  disallowDuplicateAttributes: true,
  disallowMultipleLineBreaks: true,
  disallowTrailingSpaces: true,

  requireSpacesInsideAttributeBrackets: true,
  requireLowerCaseAttributes: true,
  requireLowerCaseTags: true,
  requireSpaceAfterCodeOperator: true,
  validateDivTags: true,
  validateIndentation: 4,
  excludeFiles: ["node_modules/**"]
};