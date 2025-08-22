class NoteValidator {
  static isValidNote(value) {
    return Number.isInteger(value) && value >= 0 && value <= 5;
  }

  static validateEvaluationFields(evaluation) {
    const invalidFields = [];

    if (!this.isValidNote(evaluation.presentation_generale)) {
      invalidFields.push('presentation_generale');
    }
    if (!this.isValidNote(evaluation.stricture_méthodologie)) {
      invalidFields.push('stricture_méthodologie');
    }
    if (!this.isValidNote(evaluation.contenue_rapport)) {
      invalidFields.push('contenue_rapport');
    }
    if (!this.isValidNote(evaluation.esprit_analyse_synthèse)) {
      invalidFields.push('esprit_analyse_synthèse');
    }

    return invalidFields;
  }

  static validateEvaluationStagiaireFields(evaluation) {
    const invalidFields = [];

    if (!this.isValidNote(evaluation.ponctualite)) {
      invalidFields.push('ponctualite');
    }
    if (!this.isValidNote(evaluation.autonomie)) {
      invalidFields.push('autonomie');
    }
    if (!this.isValidNote(evaluation.integration)) {
      invalidFields.push('integration');
    }
    if (!this.isValidNote(evaluation.qualite_travaille)) {
      invalidFields.push('qualite_travaille');
    }

    return invalidFields;
  }
}

module.exports = NoteValidator;
