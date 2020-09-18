package com.doccuty.epill.diseaseinvocation;

import java.util.List;

import javax.transaction.Transactional;

import com.doccuty.epill.iteminvocation.ItemInvocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.doccuty.epill.user.User;

@Repository
@Transactional
public interface DiseaseInvocationRepository extends JpaRepository<DiseaseInvocation, Long> {

	@Query("SELECT new DiseaseInvocation(d, MAX(invocation.timestamp), COUNT(*)) FROM DiseaseInvocation invocation "
			+ "JOIN invocation.disease d "
			+ "WHERE invocation.user = :user "
			+ "GROUP BY d")
	List<DiseaseInvocation> findInvokedDiseases(@Param("user") User user);
	
	List<DiseaseInvocation> findByUser(User user);
}
