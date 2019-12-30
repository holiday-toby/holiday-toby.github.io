---
layout: post
title: "greendao使用中遇到的一些报错"
category: other
---

### 1. 数据库升级报错

```
public class WrapOpenHelper extends DaoMaster.OpenHelper {

    public WrapOpenHelper(Context context, String name, SQLiteDatabase.CursorFactory factory) {
        super(context, name, factory);
    }

    @Override
    public void onUpgrade(Database db, int oldVersion, int newVersion) {
        DevUtil.i("video module database onUpgrade", "oldVersion:" + oldVersion + ",newVersion" + newVersion);
        MigrationHelper.migrate(db, new MigrationHelper.ReCreateAllTableListener() {//防止数据库升级时候反射找不到方法
            @Override
            public void onCreateAllTables(Database db, boolean ifNotExists) {
                DaoMaster.createAllTables(db, ifNotExists);
            }

            @Override
            public void onDropAllTables(Database db, boolean ifExists) {
                DaoMaster.dropAllTables(db, ifExists);
            }
        }, VideoDao.class, ImageDao.class);//需要升级后保留数据的表追加在这里
    }
}
```



### 2. 各种缓存报错，查询的数据和数据库中的不一致

排查下来主要是数据存储到数据库之后，或者从数据库取出来以后，又在内存中修改了entity的值，由于greendao通过id缓存了entity的弱引用到内存中，如果内存中有值就会获取内存中的值，内存中的值与数据库中的值不一致导致的。这时候如果想获取到数据库中的值，有两个方式：

```
第一种清除daoSession的缓存
daoSession.clear();

第二种 清除指定dao类的缓存
dao.detachAll();
```



### 3. AS编译过程遇到了下面的警告

>API 'variant.getJavaCompiler()' is obsolete and has been replaced with 'variant.getJavaCompileProvider()'.	
>

网上找到了这个问题的[详细说明](https://blog.csdn.net/shijianduan1/article/details/86509825)

>分析：
>之前 百度的，有两种解决方法，
>
>1. 19年底会过期，暂时可以无视；
>2. 将gradle 从3.3 还原到 3.2

>我只想说，这是在埋坑。。。 我想要探究下真实的原因是什么。

>过程：
（记录下过程，以防有其他不同原因，也可以参考下，嫌我话多，就直接拉到最后看结果吧）

>根据上面错误提示，在 Terminal 中执行命令：gradle build.gradle -Pandroid.debug.obsoleteApi=true
（这个地方，困扰了我一个礼拜，排查到原因是，Terminal 不受项目配置的D:/Android/.gradle 影响， 还是执行 C:/user/.gradle的目录，而我之前又在这个地方配置了gradle.properties里http代理）
打印出来的log，见下面附件（太长了，影响阅读）
结论：

>org.greenrobot.greendao.gradle.AndroidPluginSourceProvider.addGeneratorTask(SourceProvider.kt:62)

查看[greenDao官方github的issues](https://github.com/greenrobot/greenDAO/issues/942#issuecomment-511774178)，里面提到注释掉build.gradle的一行代码就好

```
targetGenDir 'src/main/java'
```

这一句指定生成类的文件目录用到了上面过时的api。据说会在下一版本中修复。

**注释：这个问题在greendao的最新版本里面已经修复，赶在了19年底之前**

` implementation 'org.greenrobot:greendao:3.2.2' `

详细报错如下。

```
WARNING: API 'variant.getJavaCompiler()' is obsolete and has been replaced with 'variant.getJavaCompileProvider()'.
It will be removed at the end of 2019.
For more information, see https://d.android.com/r/tools/task-configuration-avoidance.
REASON: It is currently called from the following trace:
java.lang.Thread.getStackTrace(Thread.java:1556)
com.android.build.gradle.internal.errors.DeprecationReporterImpl.reportDeprecatedApi(DeprecationReporterImpl.kt:79)
com.android.build.gradle.internal.api.BaseVariantImpl.getJavaCompiler(BaseVariantImpl.java:447)
com.android.build.gradle.internal.api.ApplicationVariantImpl_Decorated.getJavaCompiler(null:-1)
org.greenrobot.greendao.gradle.AndroidPluginSourceProvider.addGeneratorTask(SourceProvider.kt:62)
org.greenrobot.greendao.gradle.AndroidPluginSourceProvider$addGeneratorTask$1.execute(SourceProvider.kt:46)
org.greenrobot.greendao.gradle.AndroidPluginSourceProvider$addGeneratorTask$1.execute(SourceProvider.kt:27)
org.gradle.api.internal.DefaultDomainObjectCollection.all(DefaultDomainObjectCollection.java:158)
org.greenrobot.greendao.gradle.AndroidPluginSourceProvider.addGeneratorTask(SourceProvider.kt:45)
org.greenrobot.greendao.gradle.Greendao3GradlePlugin$apply$1.execute(Greendao3GradlePlugin.kt:50)
org.greenrobot.greendao.gradle.Greendao3GradlePlugin$apply$1.execute(Greendao3GradlePlugin.kt:14)
org.gradle.configuration.internal.DefaultListenerBuildOperationDecorator$BuildOperationEmittingAction$1$1.run(DefaultListenerBuildOperationDecorator.java:155)
org.gradle.configuration.internal.DefaultUserCodeApplicationContext.reapply(DefaultUserCodeApplicationContext.java:58)
org.gradle.configuration.internal.DefaultListenerBuildOperationDecorator$BuildOperationEmittingAction$1.run(DefaultListenerBuildOperationDecorator.java:152)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:300)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:292)
org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:174)
org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:90)
org.gradle.configuration.internal.DefaultListenerBuildOperationDecorator$BuildOperationEmittingAction.execute(DefaultListenerBuildOperationDecorator.java:149)
org.gradle.internal.event.BroadcastDispatch$ActionInvocationHandler.dispatch(BroadcastDispatch.java:91)
org.gradle.internal.event.BroadcastDispatch$ActionInvocationHandler.dispatch(BroadcastDispatch.java:80)
org.gradle.internal.event.AbstractBroadcastDispatch.dispatch(AbstractBroadcastDispatch.java:42)
org.gradle.internal.event.BroadcastDispatch$SingletonDispatch.dispatch(BroadcastDispatch.java:230)
org.gradle.internal.event.BroadcastDispatch$SingletonDispatch.dispatch(BroadcastDispatch.java:149)
org.gradle.internal.event.AbstractBroadcastDispatch.dispatch(AbstractBroadcastDispatch.java:58)
org.gradle.internal.event.BroadcastDispatch$CompositeDispatch.dispatch(BroadcastDispatch.java:324)
org.gradle.internal.event.BroadcastDispatch$CompositeDispatch.dispatch(BroadcastDispatch.java:234)
org.gradle.internal.event.ListenerBroadcast.dispatch(ListenerBroadcast.java:140)
org.gradle.internal.event.ListenerBroadcast.dispatch(ListenerBroadcast.java:37)
org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:93)
com.sun.proxy.$Proxy33.afterEvaluate(null:-1)
org.gradle.configuration.project.LifecycleProjectEvaluator$NotifyAfterEvaluate$1.execute(LifecycleProjectEvaluator.java:187)
org.gradle.configuration.project.LifecycleProjectEvaluator$NotifyAfterEvaluate$1.execute(LifecycleProjectEvaluator.java:184)
org.gradle.api.internal.project.DefaultProject.stepEvaluationListener(DefaultProject.java:1418)
org.gradle.configuration.project.LifecycleProjectEvaluator$NotifyAfterEvaluate.run(LifecycleProjectEvaluator.java:193)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:300)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:292)
org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:174)
org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:90)
org.gradle.internal.operations.DelegatingBuildOperationExecutor.run(DelegatingBuildOperationExecutor.java:31)
org.gradle.configuration.project.LifecycleProjectEvaluator$EvaluateProject.run(LifecycleProjectEvaluator.java:110)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:300)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:292)
org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:174)
org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:90)
org.gradle.internal.operations.DelegatingBuildOperationExecutor.run(DelegatingBuildOperationExecutor.java:31)
org.gradle.configuration.project.LifecycleProjectEvaluator.evaluate(LifecycleProjectEvaluator.java:68)
org.gradle.api.internal.project.DefaultProject.evaluate(DefaultProject.java:687)
org.gradle.api.internal.project.DefaultProject.evaluate(DefaultProject.java:140)
org.gradle.execution.TaskPathProjectEvaluator.configure(TaskPathProjectEvaluator.java:35)
org.gradle.execution.TaskPathProjectEvaluator.configureHierarchy(TaskPathProjectEvaluator.java:62)
org.gradle.configuration.DefaultBuildConfigurer.configure(DefaultBuildConfigurer.java:41)
org.gradle.initialization.DefaultGradleLauncher$ConfigureBuild.run(DefaultGradleLauncher.java:274)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:300)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:292)
org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:174)
org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:90)
org.gradle.internal.operations.DelegatingBuildOperationExecutor.run(DelegatingBuildOperationExecutor.java:31)
org.gradle.initialization.DefaultGradleLauncher.configureBuild(DefaultGradleLauncher.java:182)
org.gradle.initialization.DefaultGradleLauncher.doBuildStages(DefaultGradleLauncher.java:141)
org.gradle.initialization.DefaultGradleLauncher.executeTasks(DefaultGradleLauncher.java:124)
org.gradle.internal.invocation.GradleBuildController$1.call(GradleBuildController.java:77)
org.gradle.internal.invocation.GradleBuildController$1.call(GradleBuildController.java:74)
org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:154)
org.gradle.internal.work.StopShieldingWorkerLeaseService.withLocks(StopShieldingWorkerLeaseService.java:38)
org.gradle.internal.invocation.GradleBuildController.doBuild(GradleBuildController.java:96)
org.gradle.internal.invocation.GradleBuildController.run(GradleBuildController.java:74)
org.gradle.tooling.internal.provider.runner.ClientProvidedPhasedActionRunner.run(ClientProvidedPhasedActionRunner.java:61)
org.gradle.launcher.exec.ChainingBuildActionRunner.run(ChainingBuildActionRunner.java:35)
org.gradle.launcher.exec.ChainingBuildActionRunner.run(ChainingBuildActionRunner.java:35)
org.gradle.tooling.internal.provider.ValidatingBuildActionRunner.run(ValidatingBuildActionRunner.java:32)
org.gradle.launcher.exec.RunAsBuildOperationBuildActionRunner$3.run(RunAsBuildOperationBuildActionRunner.java:50)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:300)
org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:292)
org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:174)
org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:90)
org.gradle.internal.operations.DelegatingBuildOperationExecutor.run(DelegatingBuildOperationExecutor.java:31)
org.gradle.launcher.exec.RunAsBuildOperationBuildActionRunner.run(RunAsBuildOperationBuildActionRunner.java:45)
org.gradle.tooling.internal.provider.SubscribableBuildActionRunner.run(SubscribableBuildActionRunner.java:51)
org.gradle.launcher.exec.InProcessBuildActionExecuter$1.transform(InProcessBuildActionExecuter.java:47)
org.gradle.launcher.exec.InProcessBuildActionExecuter$1.transform(InProcessBuildActionExecuter.java:44)
org.gradle.composite.internal.DefaultRootBuildState.run(DefaultRootBuildState.java:79)
org.gradle.launcher.exec.InProcessBuildActionExecuter.execute(InProcessBuildActionExecuter.java:44)
org.gradle.launcher.exec.InProcessBuildActionExecuter.execute(InProcessBuildActionExecuter.java:30)
org.gradle.launcher.exec.BuildTreeScopeBuildActionExecuter.execute(BuildTreeScopeBuildActionExecuter.java:39)
org.gradle.launcher.exec.BuildTreeScopeBuildActionExecuter.execute(BuildTreeScopeBuildActionExecuter.java:25)
org.gradle.tooling.internal.provider.ContinuousBuildActionExecuter.execute(ContinuousBuildActionExecuter.java:80)
org.gradle.tooling.internal.provider.ContinuousBuildActionExecuter.execute(ContinuousBuildActionExecuter.java:53)
org.gradle.tooling.internal.provider.ServicesSetupBuildActionExecuter.execute(ServicesSetupBuildActionExecuter.java:62)
org.gradle.tooling.internal.provider.ServicesSetupBuildActionExecuter.execute(ServicesSetupBuildActionExecuter.java:34)
org.gradle.tooling.internal.provider.GradleThreadBuildActionExecuter.execute(GradleThreadBuildActionExecuter.java:36)
org.gradle.tooling.internal.provider.GradleThreadBuildActionExecuter.execute(GradleThreadBuildActionExecuter.java:25)
org.gradle.tooling.internal.provider.ParallelismConfigurationBuildActionExecuter.execute(ParallelismConfigurationBuildActionExecuter.java:43)
org.gradle.tooling.internal.provider.ParallelismConfigurationBuildActionExecuter.execute(ParallelismConfigurationBuildActionExecuter.java:29)
org.gradle.tooling.internal.provider.StartParamsValidatingActionExecuter.execute(StartParamsValidatingActionExecuter.java:59)
org.gradle.tooling.internal.provider.StartParamsValidatingActionExecuter.execute(StartParamsValidatingActionExecuter.java:31)
org.gradle.tooling.internal.provider.SessionFailureReportingActionExecuter.execute(SessionFailureReportingActionExecuter.java:59)
org.gradle.tooling.internal.provider.SessionFailureReportingActionExecuter.execute(SessionFailureReportingActionExecuter.java:44)
org.gradle.tooling.internal.provider.SetupLoggingActionExecuter.execute(SetupLoggingActionExecuter.java:46)
org.gradle.tooling.internal.provider.SetupLoggingActionExecuter.execute(SetupLoggingActionExecuter.java:30)
org.gradle.launcher.daemon.server.exec.ExecuteBuild.doBuild(ExecuteBuild.java:67)
org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:36)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.WatchForDisconnection.execute(WatchForDisconnection.java:37)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.ResetDeprecationLogger.execute(ResetDeprecationLogger.java:26)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.RequestStopIfSingleUsedDaemon.execute(RequestStopIfSingleUsedDaemon.java:34)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.ForwardClientInput$2.call(ForwardClientInput.java:74)
org.gradle.launcher.daemon.server.exec.ForwardClientInput$2.call(ForwardClientInput.java:72)
org.gradle.util.Swapper.swap(Swapper.java:38)
org.gradle.launcher.daemon.server.exec.ForwardClientInput.execute(ForwardClientInput.java:72)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.LogAndCheckHealth.execute(LogAndCheckHealth.java:55)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.LogToClient.doBuild(LogToClient.java:62)
org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:36)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.EstablishBuildEnvironment.doBuild(EstablishBuildEnvironment.java:81)
org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:36)
org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:122)
org.gradle.launcher.daemon.server.exec.StartBuildOrRespondWithBusy$1.run(StartBuildOrRespondWithBusy.java:50)
org.gradle.launcher.daemon.server.DaemonStateCoordinator$1.run(DaemonStateCoordinator.java:295)
org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:63)
org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:46)
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:55)
java.lang.Thread.run(Thread.java:745)

WARNING: Debugging obsolete API calls can take time during configuration. It's recommended to not keep it on at all times.
Affected Modules: myDemo

```

