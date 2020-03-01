<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTask" @keyup.enter="addTask">
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" @click="doneAll()">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li class="todo" v-for="task in tasks" :key="task.id" :class="{completed: task.completed, editing: task == editedTask}">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="task.completed" @click="toggleTask(task)">
            <label @dblclick="editTask(task)">{{task.name}}</label>
            <button class="destroy" @click="removeTask(task)"></button>
          </div>
          <input class="edit" type="text" v-model="task.name" v-todo-focus="task == editedTask" @blur="doneEdit(task)" @keyup.enter="doneEdit(task)" @keyup.esc="cancelEdit(task)">
        </li>
      </ul>
    </section>
  </section>
</template>
<script>
export default {
  data(){
    return {
      newTask: null,
      editedTask: null,
      tasks: [],
      beforeEditCache: null,
      allDone: false
    }
  },
  watch: {
    visibility: {
      immediate: true,
      handler(){
        this.load();
      }
    },
  },
  mounted(){
  },
  methods: {
    async load(){
      this.$set(this, 'tasks', await this.$faas('task/index').then(res => res.data))
    },
    async addTask(){
      await this.$faas('task/create', { name: this.newTask});
      await this.load();
      this.newTask = null;
    },
    editTask(task){
      this.beforeEditCache = task.name;
      this.editedTask = task;
    },
    async doneEdit(task){
      if (!this.editedTask) {
        return;
      }
      this.editedTask = null;
      task.name = task.name.trim();
      if (!task.name) {
        this.removeTask(task);
      }else{
        await this.$faas('task/update', { id: task.id, name: task.name });
        await this.load();
      }
    },
    cancelEdit(task){
      task.name = this.beforeEditCache;
      this.editedTask = null;
    },
    async removeTask(task){
      await this.$faas('task/destroy', { id: task.id });
      await this.load();
    },
    async toggleTask(task){
      await this.$faas('task/update', { id: task.id, completed: task.completed ? 0 : 1 })
    },
    async doneAll(){
      await this.$faas('task/done-all');
      await this.load();
    }
  }
}
</script>
