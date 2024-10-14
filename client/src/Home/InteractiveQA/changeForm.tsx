export async function putSelectedQuestion(questions: number[], id: number) {
  try {
    alert(`Selected questions: ${questions}`);
    alert(`Updating selected questions for id: ${id}`);
    await fetch(`http://localhost:4000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedQuestions: questions }),
    });
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}
