SET ABOT_MONGODB=testdb2

del smbmodel\_cache.js.zip

@rem do not use any file cache
SET MQNLQ_MODEL_NO_FILECACHE=1

@rem use db !
SET MGNLQ_TESTMODEL2_REPLAY=OFF

@rem write a run record
SET ABOT_WRITE_REGRESS=1





nodeunit test\regress\smartdialog.regress.nunit.js